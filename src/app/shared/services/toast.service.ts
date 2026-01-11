import { Injectable, inject, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Service de notification toast
 * Gère l'affichage des messages de succès, d'erreur, d'info et d'avertissement
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 0;

  /**
   * Récupérer la liste des toasts (signal)
   */
  getToasts() {
    return this.toasts.asReadonly();
  }

  /**
   * Afficher un toast de succès
   * @param message Message à afficher
   * @param duration Durée d'affichage en ms (défaut: 3000)
   */
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Afficher un toast d'erreur
   * @param message Message à afficher
   * @param duration Durée d'affichage en ms (défaut: 5000)
   */
  error(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Afficher un toast d'information
   * @param message Message à afficher
   * @param duration Durée d'affichage en ms (défaut: 3000)
   */
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Afficher un toast d'avertissement
   * @param message Message à afficher
   * @param duration Durée d'affichage en ms (défaut: 4000)
   */
  warning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Afficher un toast
   * @param message Message à afficher
   * @param type Type de toast
   * @param duration Durée d'affichage en ms
   */
  private show(message: string, type: Toast['type'], duration: number): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration,
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    // Supprimer automatiquement après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  /**
   * Supprimer un toast
   * @param id ID du toast à supprimer
   */
  remove(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  /**
   * Supprimer tous les toasts
   */
  clear(): void {
    this.toasts.set([]);
  }
}

// Instance globale du service (sera initialisée)
let toastServiceInstance: ToastService | null = null;

/**
 * Initialiser l'instance du service toast
 * À appeler une fois au démarrage de l'application
 */
export function initToastService(service: ToastService): void {
  toastServiceInstance = service;
}

/**
 * Fonction helper pour utiliser le service toast de manière globale
 * Utilisation: toast.success('Message'), toast.error('Message')
 * 
 * Note: Le service doit être initialisé avec initToastService() dans app.ts
 */
export const toast = {
  success: (message: string, duration?: number) => {
    if (toastServiceInstance) {
      toastServiceInstance.success(message, duration);
    } else {
      console.warn('ToastService non initialisé. Appelez initToastService() dans app.ts');
    }
  },
  error: (message: string, duration?: number) => {
    if (toastServiceInstance) {
      toastServiceInstance.error(message, duration);
    } else {
      console.warn('ToastService non initialisé. Appelez initToastService() dans app.ts');
    }
  },
  info: (message: string, duration?: number) => {
    if (toastServiceInstance) {
      toastServiceInstance.info(message, duration);
    } else {
      console.warn('ToastService non initialisé. Appelez initToastService() dans app.ts');
    }
  },
  warning: (message: string, duration?: number) => {
    if (toastServiceInstance) {
      toastServiceInstance.warning(message, duration);
    } else {
      console.warn('ToastService non initialisé. Appelez initToastService() dans app.ts');
    }
  },
};

