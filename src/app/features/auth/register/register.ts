import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../core/models/auth.models';
import { toast } from '../../../shared/services/toast.service';

/**
 * Composant d'inscription
 * Permet aux clients de créer un compte
 * Validation complète du formulaire avec confirmation de mot de passe
 */
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;

  constructor() {
    // Créer le formulaire avec validation correspondant au DTO Java
    // ClientRegisterDto: name, email, phone, address (optionnel), password
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
        address: ['', [Validators.maxLength(255)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }


  /**
   * Validateur pour vérifier que les mots de passe correspondent
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Soumettre le formulaire d'inscription
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marquer tous les champs comme touchés
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const registerData: RegisterRequest = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      address: this.registerForm.value.address || undefined, // Envoyer undefined si vide
      password: this.registerForm.value.password,
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Afficher un toast de succès avec le message du backend
        toast.success(response.message || 'Inscription réussie ! Redirection en cours...');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { registered: true },
          });
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        // Afficher un toast d'erreur avec le message détaillé
        const errorMsg = error.message || error.detail || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        toast.error(errorMsg);
        console.error('Erreur complète:', error);
      },
    });
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Récupérer le message d'erreur d'un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${requiredLength} caractères`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères`;
    }
    if (this.registerForm.hasError('passwordMismatch') && fieldName === 'confirmPassword') {
      return 'Les mots de passe ne correspondent pas';
    }
    
    return '';
  }

  /**
   * Vérifier la force du mot de passe (pour affichage visuel)
   * Minimum 6 caractères selon le backend
   */
  getPasswordStrength(): 'weak' | 'medium' | 'strong' | null {
    const password = this.registerForm.get('password')?.value;
    if (!password) {
      return null;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
}

