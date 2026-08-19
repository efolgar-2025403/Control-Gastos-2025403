import {
  Component,
  inject,
  OnInit
} from '@angular/core';

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
export class Login implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  showPassword = false;

  errorMessage = '';
  loading = false;

  ngOnInit(): void {

    const sessionExpired =
      localStorage.getItem(
        'control-gastos-session-expired'
      );

    if (sessionExpired) {

      this.errorMessage =
        sessionExpired;

      localStorage.removeItem(
        'control-gastos-session-expired'
      );

    }

  }

  login(): void {

    this.errorMessage = '';

    if (
      !this.email.trim() ||
      !this.password
    ) {

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

        this.router.navigate([
          '/dashboard'
        ]);

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

    this.showPassword =
      !this.showPassword;

  }

}