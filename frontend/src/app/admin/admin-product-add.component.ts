import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductPayload, ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-product-add',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-product-add.component.html',
  styleUrl: './admin-product-add.component.css',
})
export class AdminProductAddComponent {
  private readonly api = inject(ProductService);
  private readonly router = inject(Router);

  form: ProductPayload = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    sku: '',
  };

  err = '';
  saving = false;

  save(): void {
    this.err = '';
    const name = this.form.name.trim();
    const sku = this.form.sku.trim();
    const desc = (this.form.description ?? '').trim();
    const price = Number(this.form.price);
    const stock = Number(this.form.stockQuantity);
    if (!name || !sku || price <= 0 || stock < 0) {
      this.err = 'Name, SKU, price above 0, and stock are required.';
      return;
    }
    this.saving = true;
    this.api.create({ name, description: desc, price, stockQuantity: stock, sku }).subscribe({
      next: () => void this.router.navigate(['/admin', 'products']),
      error: (e: HttpErrorResponse) => {
        this.err = e.status === 409 ? 'That SKU is already in use.' : 'Could not save.';
        this.saving = false;
      },
      complete: () => (this.saving = false),
    });
  }
}
