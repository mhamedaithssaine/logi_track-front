import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientApiService } from '../../../../core/api/client-api.service';
import { ClientCreateDto, ClientUpdateDto } from '../../../../core/models/client.models';
import { toast } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ClientApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  id: number | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.isEditMode = !!this.id;

    if (this.isEditMode && this.id) {
      this.loadClient();
      this.form.get('password')?.setValidators([
        (c) => {
          const v = c?.value as string;
          if (!v || v.length === 0) return null;
          return v.length >= 6 ? null : { minlength: { requiredLength: 6 } };
        },
      ]);
      this.form.get('password')?.updateValueAndValidity();
    } else {
      // mot de passe requis en création
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  loadClient(): void {
    if (!this.id) return;
    this.isLoading = true;
    this.service.getById(this.id).subscribe({
      next: (c) => {
        this.form.patchValue({
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          address: c.address || '',
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        toast.error(error.message || 'Erreur lors du chargement du client');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((k) => this.form.get(k)?.markAsTouched());
      return;
    }

    this.isLoading = true;
    const v = this.form.getRawValue();

    if (this.isEditMode && this.id) {
      const dto: ClientUpdateDto = {
        name: v.name,
        email: v.email,
        password: v.password || undefined,
        phone: v.phone || undefined,
        address: v.address || undefined,
      };

      this.service.update(this.id, dto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Client mis à jour avec succès');
          this.router.navigate(['/admin/users/clients']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la mise à jour');
        },
      });
    } else {
      const dto: ClientCreateDto = {
        name: v.name,
        email: v.email,
        phone: v.phone || undefined,
        address: v.address || undefined,
        password: v.password,
      };

      this.service.create(dto).subscribe({
        next: () => {
          this.isLoading = false;
          toast.success('Client créé avec succès');
          this.router.navigate(['/admin/users/clients']);
        },
        error: (error) => {
          this.isLoading = false;
          toast.error(error.message || 'Erreur lors de la création');
        },
      });
    }
  }

  hasError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (c?.hasError('required')) return 'Ce champ est obligatoire';
    if (c?.hasError('email')) return 'Email invalide';
    if (c?.hasError('minlength')) return 'Minimum 6 caractères';
    return '';
  }
}

