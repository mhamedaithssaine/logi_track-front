import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-warehouse-placeholder',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wm-placeholder">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <a routerLink="/warehouse/dashboard" class="wm-placeholder-link">← Retour au tableau de bord</a>
    </div>
  `,
  styles: [
    `
      .wm-placeholder {
        text-align: center;
        padding: 60px 24px;
        max-width: 480px;
        margin: 0 auto;
      }
      .wm-placeholder h2 {
        margin: 0 0 16px;
        font-size: 24px;
        font-weight: 600;
        color: #f1f5f9;
      }
      .wm-placeholder p {
        margin: 0 0 24px;
        font-size: 16px;
        color: #94a3b8;
        line-height: 1.5;
      }
      .wm-placeholder-link {
        display: inline-block;
        padding: 12px 24px;
        background: rgba(13, 148, 136, 0.2);
        color: #5eead4;
        border: 1px solid #0d9488;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      .wm-placeholder-link:hover {
        background: #0d9488;
        color: #0f172a;
      }
    `,
  ],
})
export class WarehousePlaceholder {
  private route = inject(ActivatedRoute);

  get title(): string {
    return (this.route.snapshot.data['title'] as string) ?? 'En cours de développement';
  }

  get message(): string {
    return (this.route.snapshot.data['message'] as string) ?? 'Cette section sera disponible prochainement.';
  }
}
