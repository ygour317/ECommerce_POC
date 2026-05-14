import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductPayload, ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-product-edit.component.html',
  styleUrl: './admin-product-edit.component.css',
})
export class AdminProductEditComponent implements OnInit {
  private readonly api = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  productId: number | null = null;
  form: ProductPayload = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    sku: '',
  };

  err = '';
  loadErr = '';
  saving = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const num = id ? Number(id) : NaN;
    if (!Number.isFinite(num) || num < 1) {
      this.loadErr = 'Invalid product.';
      return;
    }
    this.productId = num;
    this.api.getById(num).subscribe({
      next: (p) => {
        this.form = {
          name: p.name,
          description: p.description ?? '',
          price: p.price,
          stockQuantity: p.stockQuantity,
          sku: p.sku,
        };
      },
      error: () => {
        this.loadErr = 'Product not found.';
        this.productId = null;
      },
    });
  }

  save(): void {
    if (this.productId == null) {
      return;
    }
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
    this.api
      .update(this.productId, { name, description: desc, price, stockQuantity: stock, sku })
      .subscribe({
        next: () => void this.router.navigate(['/admin', 'products']),
        error: (e: HttpErrorResponse) => {
          this.err = e.status === 409 ? 'SKU conflict with another product.' : 'Could not save.';
          this.saving = false;
        },
        complete: () => (this.saving = false),
      });
  }
}
