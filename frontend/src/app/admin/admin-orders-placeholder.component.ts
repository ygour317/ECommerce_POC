import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-orders-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section>
      <h1 class="page-title">Orders</h1>
      <p class="lead">Order history and fulfillment will be wired up here later.</p>
      <p class="hint">For now you can manage the catalog under <a routerLink="/admin/products">All products</a>.</p>
    </section>
  `,
  styles: [
    `
      .page-title {
        margin: 0 0 0.35rem;
        font-size: 1.35rem;
        color: #0f172a;
      }
      .lead {
        margin: 0 0 0.75rem;
        color: #64748b;
        font-size: 0.95rem;
      }
      .hint {
        color: #475569;
        font-size: 0.9rem;
      }
      .hint a {
        color: #2563eb;
      }
    `,
  ],
})
export class AdminOrdersPlaceholderComponent {}
