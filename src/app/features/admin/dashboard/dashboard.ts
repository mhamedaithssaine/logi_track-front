import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../../core/api/product-api.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Tableau de bord</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Produits</h3>
          <p class="stat-value">{{ productsCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Entrepôts</h3>
          <p class="stat-value">0</p>
        </div>
        <div class="stat-card">
          <h3>Commandes</h3>
          <p class="stat-value">0</p>
        </div>
        <div class="stat-card">
          <h3>Utilisateurs</h3>
          <p class="stat-value">0</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }

      .dashboard h2 {
        margin: 0 0 32px 0;
        color: #1a202c;
        font-size: 28px;
        font-weight: 600;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        width: 100%;
      }

      .stat-card {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        border: 1px solid #e2e8f0;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: #cbd5e0;
        }

        h3 {
          margin: 0 0 12px;
          color: #718096;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          margin: 0;
          font-size: 36px;
          font-weight: 700;
          color: #1a202c;
          line-height: 1.2;
        }
      }

      @media (max-width: 768px) {
        .dashboard h2 {
          font-size: 24px;
          margin-bottom: 24px;
        }

        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          padding: 20px;

          .stat-value {
            font-size: 28px;
          }
        }
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminDashboard implements OnInit {
  private productService = inject(ProductApiService);
  productsCount = 0;

  ngOnInit(): void {
    this.loadProductsCount();
  }

  loadProductsCount(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.productsCount = products.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      },
    });
  }
}

