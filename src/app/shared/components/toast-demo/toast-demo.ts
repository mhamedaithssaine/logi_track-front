import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toast } from '../../services/toast.service';

/**
 * Composant de démonstration pour tester les toasts
 * Accessible via /toast-demo
 */
@Component({
  selector: 'app-toast-demo',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="toast-demo-container">
      <div class="toast-demo-card">
        <h1>Test des Toasts</h1>
        <p>Cliquez sur les boutons ci-dessous pour tester les différents types de toasts :</p>
        
        <div class="button-group">
          <button class="btn btn-success" (click)="showSuccess()">
            Toast Success
          </button>
          
          <button class="btn btn-error" (click)="showError()">
            Toast Error
          </button>
          
          <button class="btn btn-warning" (click)="showWarning()">
            Toast Warning
          </button>
          
          <button class="btn btn-info" (click)="showInfo()">
            Toast Info
          </button>
        </div>

        <div class="button-group">
          <button class="btn btn-secondary" (click)="showMultiple()">
            Afficher plusieurs toasts
          </button>
        </div>

        <div class="info-section">
          <h2>Instructions :</h2>
          <ul>
            <li>Les toasts apparaissent en haut à droite de l'écran</li>
            <li>Ils se ferment automatiquement après quelques secondes</li>
            <li>Vous pouvez aussi les fermer manuellement avec le bouton X</li>
            <li>Testez aussi dans les pages Login et Register</li>
          </ul>
        </div>

        <div class="navigation">
          <a routerLink="/auth/login" class="link">→ Aller à la page Login</a>
          <a routerLink="/auth/register" class="link">→ Aller à la page Register</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-demo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .toast-demo-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 600px;
      width: 100%;
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 8px;
    }

    p {
      color: #718096;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-success {
      background: #38a169;
      color: white;
    }

    .btn-success:hover {
      background: #2f855a;
      transform: translateY(-2px);
    }

    .btn-error {
      background: #e53e3e;
      color: white;
    }

    .btn-error:hover {
      background: #c53030;
      transform: translateY(-2px);
    }

    .btn-warning {
      background: #ed8936;
      color: white;
    }

    .btn-warning:hover {
      background: #dd6b20;
      transform: translateY(-2px);
    }

    .btn-info {
      background: #3182ce;
      color: white;
    }

    .btn-info:hover {
      background: #2c5aa0;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #718096;
      color: white;
    }

    .btn-secondary:hover {
      background: #4a5568;
      transform: translateY(-2px);
    }

    .info-section {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .info-section h2 {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 12px;
    }

    .info-section ul {
      list-style: disc;
      padding-left: 20px;
      color: #4a5568;
    }

    .info-section li {
      margin-bottom: 8px;
    }

    .navigation {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .link:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  `]
})
export class ToastDemoComponent {
  showSuccess(): void {
    toast.success('Connexion réussie ! Bienvenue !');
  }

  showError(): void {
    toast.error('Erreur de connexion. Vérifiez vos identifiants.');
  }

  showWarning(): void {
    toast.warning('Attention : Votre session expire dans 5 minutes.');
  }

  showInfo(): void {
    toast.info('Nouvelle mise à jour disponible.');
  }

  showMultiple(): void {
    toast.success('Premier toast - Succès');
    setTimeout(() => toast.error('Deuxième toast - Erreur'), 500);
    setTimeout(() => toast.warning('Troisième toast - Avertissement'), 1000);
    setTimeout(() => toast.info('Quatrième toast - Information'), 1500);
  }
}

