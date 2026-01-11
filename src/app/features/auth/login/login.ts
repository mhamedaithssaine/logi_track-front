import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';
import { toast } from '../../../shared/services/toast.service';

/**
 * Composant de connexion
 * Gère l'authentification avec email/password
 * Option "Remember me" pour persister la session
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = false;
  returnUrl: string | null = null;

  constructor() {
    // Créer le formulaire avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Récupérer l'URL de retour si présente
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
  }

  /**
   * Soumettre le formulaire de connexion
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Afficher un toast de succès
        toast.success('Connexion réussie !');
        
        // Si "Remember me" est coché, utiliser localStorage au lieu de sessionStorage
        if (this.loginForm.value.rememberMe) {
          // Le service gère déjà le stockage, mais on pourrait adapter ici
          // pour utiliser localStorage si nécessaire
        }

        // Rediriger selon le rôle ou l'URL de retour
        this.redirectAfterLogin();
      },
      error: (error) => {
        this.isLoading = false;
        // Afficher un toast d'erreur
        toast.error(error.message || 'Erreur de connexion. Vérifiez vos identifiants.');
      },
    });
  }

  /**
   * Rediriger après connexion réussie
   */
  private redirectAfterLogin(): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      // Rediriger selon le rôle
      const user = this.authService.getCurrentUser();
      if (user) {
        switch (user.role) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'WAREHOUSE_MANAGER':
            this.router.navigate(['/warehouse']);
            break;
          case 'CLIENT':
            this.router.navigate(['/client']);
            break;
          default:
            this.router.navigate(['/']);
        }
      }
    }
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Récupérer le message d'erreur d'un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('email')) {
      return 'Email invalide';
    }
    if (field?.hasError('minlength')) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}
