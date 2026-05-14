import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.css',
})
export class UserProductsComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly productsApi = inject(ProductService);

  email = '';
  products: Product[] = [];
  errorMsg = '';

  private readonly thumbPalette = ['#4f46e5', '#0369a1', '#0d9488', '#b45309', '#7c3aed', '#be185d'];

  ngOnInit(): void {
    this.email = this.auth.getEmail() ?? '';
    this.load();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  initial(name: string): string {
    const t = (name ?? '').trim();
    return t ? t.charAt(0).toUpperCase() : '?';
  }

  thumbColor(id: number): string {
    return this.thumbPalette[id % this.thumbPalette.length];
  }

  load(): void {
    this.errorMsg = '';
    this.productsApi.list().subscribe({
      next: (list) => (this.products = list),
      error: () => (this.errorMsg = 'Could not load products. Try again in a moment.'),
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
