import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.scss',
})
export class QuantitySelector {
  quantity = input.required<number>();
  min = input(1);
  max = input(99);
  quantityChange = output<number>();

  change(delta: number): void {
    const next = Math.max(this.min(), Math.min(this.max(), this.quantity() + delta));
    this.quantityChange.emit(next);
  }
}
