import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  fullName = '';
  errorMessage = '';
  loading = false;

  submit(): void {
    this.errorMessage = '';
    this.loading = true;
    const name = this.fullName.trim();
    this.auth.register(this.email.trim(), this.password, name || undefined).subscribe({
      next: () => void this.router.navigate(['/home']),
      error: () => {
        this.errorMessage =
          'Could not register. The email may already be in use or the data is invalid.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
