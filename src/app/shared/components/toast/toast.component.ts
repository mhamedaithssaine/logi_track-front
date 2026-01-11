import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { initToastService } from '../../services/toast.service';

/**
 * Composant pour afficher les toasts
 * À placer dans le template principal (app.html)
 */
@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toasts = this.toastService.getToasts();

  ngOnInit(): void {
    // Initialiser l'instance globale pour la fonction toast()
    initToastService(this.toastService);
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}

