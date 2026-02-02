import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierApiService } from '../../../core/api/carrier-api.service';
import { CarrierResponseDto } from '../../../core/models/carrier.models';
import { toast } from '../../../shared/services/toast.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-carrier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialog],
  templateUrl: './carrier-list.html',
  styleUrl: './carrier-list.scss',
})
export class CarrierList implements OnInit {
  private carrierApi = inject(CarrierApiService);
  private cdr = inject(ChangeDetectorRef);

  carriers: CarrierResponseDto[] = [];
  isLoading = false;
  showForm = false;
  editingId: number | null = null;
  formCode = '';
  formName = '';
  formActive = true;
  submitting = false;
  deleteConfirmOpen = false;
  deleteTarget: CarrierResponseDto | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.carrierApi.list(false).subscribe({
      next: (list) => {
        this.carriers = list ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carriers = [];
        this.isLoading = false;
        toast.error('Erreur chargement transporteurs.');
        this.cdr.detectChanges();
      },
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.formCode = '';
    this.formName = '';
    this.formActive = true;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  openEdit(c: CarrierResponseDto): void {
    this.editingId = c.id;
    this.formCode = c.code;
    this.formName = c.name;
    this.formActive = c.active;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.cdr.detectChanges();
  }

  submit(): void {
    const code = this.formCode.trim().toUpperCase();
    const name = this.formName.trim();
    if (!code || !name) {
      toast.error('Code et nom requis.');
      return;
    }
    this.submitting = true;
    this.cdr.detectChanges();
    if (this.editingId) {
      this.carrierApi.update(this.editingId, { name, active: this.formActive }).subscribe({
        next: () => {
          toast.success('Transporteur mis à jour.');
          this.closeForm();
          this.load();
          this.submitting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          toast.error(err?.message || err?.error?.message || 'Erreur.');
          this.submitting = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.carrierApi.create({ code, name, active: this.formActive }).subscribe({
        next: () => {
          toast.success('Transporteur créé.');
          this.closeForm();
          this.load();
          this.submitting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          toast.error(err?.message || err?.error?.message || 'Erreur.');
          this.submitting = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  requestDelete(c: CarrierResponseDto): void {
    this.deleteTarget = c;
    this.deleteConfirmOpen = true;
    this.cdr.detectChanges();
  }

  onConfirmDelete(): void {
    if (!this.deleteTarget) return;
    this.carrierApi.delete(this.deleteTarget.id).subscribe({
      next: () => {
        toast.success('Transporteur supprimé.');
        this.deleteConfirmOpen = false;
        this.deleteTarget = null;
        this.load();
        this.cdr.detectChanges();
      },
      error: (err) => {
        toast.error(err?.message || err?.error?.message || 'Erreur suppression.');
        this.deleteConfirmOpen = false;
        this.deleteTarget = null;
        this.cdr.detectChanges();
      },
    });
  }

  onCancelDelete(): void {
    this.deleteConfirmOpen = false;
    this.deleteTarget = null;
    this.cdr.detectChanges();
  }
}
