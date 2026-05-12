import { Component, inject, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly auth = inject(AuthService);

  profile: UserProfile | null = null;
  loadError = '';

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (p) => (this.profile = p),
      error: () => {
        this.loadError = 'Could not load your profile. Try signing in again.';
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
