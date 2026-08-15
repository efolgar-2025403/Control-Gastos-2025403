import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  showPassword = false;

  errorMessage = '';
  loading = false;

  login(): void {

    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage =
        'Ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;

    this.authService.login(
      this.email.trim(),
      this.password
    ).subscribe({

      next: () => {

        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: error => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Correo o contraseña incorrectos.';
      }

    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}