import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../services/auth.service';
import { Product, ProductPayload, ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly productsApi = inject(ProductService);

  profile: UserProfile | null = null;
  profileError = '';

  products: Product[] = [];
  productsError = '';

  adminMessage = '';
  adminError = '';

  editingId: number | null = null;

  form: ProductPayload = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    sku: '',
  };

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (p) => {
        this.profile = p;
        this.loadProducts();
      },
      error: () => {
        this.profileError = 'Could not load your profile. Try signing in again.';
      },
    });
  }

  get isAdmin(): boolean {
    return this.profile?.role === 'ADMIN';
  }

  get welcomeSuffix(): string {
    const raw = this.profile?.fullName?.trim();
    if (!raw) {
      return '';
    }
    const first = raw.split(/\s+/)[0];
    return first ? `, ${first}` : '';
  }

  logout(): void {
    this.auth.logout();
  }

  loadProducts(): void {
    this.productsError = '';
    this.productsApi.list().subscribe({
      next: (list) => (this.products = list),
      error: () => (this.productsError = 'Could not load products.'),
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', description: '', price: 0, stockQuantity: 0, sku: '' };
    this.adminError = '';
    this.adminMessage = '';
  }

  startCreate(): void {
    this.resetForm();
    this.adminMessage = 'Fill in the form to add a new product.';
  }

  startEdit(p: Product): void {
    this.editingId = p.id;
    this.form = {
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      stockQuantity: p.stockQuantity,
      sku: p.sku,
    };
    this.adminError = '';
    this.adminMessage = `Editing #${p.id}`;
  }

  saveProduct(): void {
    this.adminError = '';
    this.adminMessage = '';
    const payload: ProductPayload = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      price: Number(this.form.price),
      stockQuantity: Number(this.form.stockQuantity),
      sku: this.form.sku.trim(),
    };
    if (!payload.name || !payload.sku || payload.price <= 0) {
      this.adminError = 'Name, SKU, and a positive price are required.';
      return;
    }
    if (this.editingId != null) {
      this.productsApi.update(this.editingId, payload).subscribe({
        next: () => {
          this.adminMessage = 'Product updated.';
          this.resetForm();
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) =>
          (this.adminError =
            err.status === 403
              ? 'Only administrators can modify products.'
              : 'Update failed. Check SKU uniqueness or try again.'),
      });
    } else {
      this.productsApi.create(payload).subscribe({
        next: () => {
          this.adminMessage = 'Product created.';
          this.resetForm();
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) =>
          (this.adminError =
            err.status === 403
              ? 'Only administrators can modify products.'
              : 'Create failed. SKU may already exist.'),
      });
    }
  }

  removeProduct(p: Product): void {
    if (!confirm(`Delete "${p.name}"?`)) {
      return;
    }
    this.adminError = '';
    this.productsApi.delete(p.id).subscribe({
      next: () => {
        this.adminMessage = 'Product deleted.';
        if (this.editingId === p.id) {
          this.resetForm();
        }
        this.loadProducts();
      },
      error: (err: HttpErrorResponse) =>
        (this.adminError =
          err.status === 403 ? 'Only administrators can delete products.' : 'Delete failed.'),
    });
  }
}
