import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.css',
})
export class AdminProductListComponent implements OnInit {
  private readonly api = inject(ProductService);
  private readonly router = inject(Router);

  products: Product[] = [];
  errorMsg = '';
  busyId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMsg = '';
    this.api.list().subscribe({
      next: (list) => (this.products = list),
      error: () => (this.errorMsg = 'Could not load products.'),
    });
  }

  remove(p: Product): void {
    if (!confirm(`Remove "${p.name}" from the catalog?`)) {
      return;
    }
    this.busyId = p.id;
    this.api.delete(p.id).subscribe({
      next: () => this.load(),
      error: () => {
        this.errorMsg = 'Delete failed.';
        this.busyId = null;
      },
      complete: () => (this.busyId = null),
    });
  }

  goEdit(id: number): void {
    void this.router.navigate(['/admin', 'products', 'edit', id]);
  }
}
