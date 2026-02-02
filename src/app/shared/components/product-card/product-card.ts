import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuantitySelector } from '../quantity-selector/quantity-selector';
import type { ProductResponseDto } from '../../../core/models/product.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, QuantitySelector],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<ProductResponseDto>();
  quantity = input(1);
  detailLink = input<string[]>([]);

  quantityChange = output<number>();
  reserve = output<ProductResponseDto>();
}
