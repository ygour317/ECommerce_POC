import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  submit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => void this.router.navigate(['/home']),
      error: () => {
        this.errorMessage = 'Invalid email or password.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
