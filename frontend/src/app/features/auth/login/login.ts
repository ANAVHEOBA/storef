import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LoginApiService } from '../../../../lib/login/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login">
      <h2>Sign In</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            formControlName="email"
            placeholder="Enter your email"
          >
          <div class="error" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
            Email is required
          </div>
          <div class="error" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
            Please enter a valid email
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input 
              [type]="passwordVisible ? 'text' : 'password'"
              id="password"
              formControlName="password"
              placeholder="Enter your password"
            >
            <i class="toggle-password fa" [ngClass]="{'fa-eye-slash': passwordVisible, 'fa-eye': !passwordVisible}" (click)="togglePasswordVisibility()"></i>
          </div>
          <div class="error" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
            Password is required
          </div>
        </div>

        <button type="submit" [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="message" *ngIf="message" [class.error]="!success">
        {{ message }}
      </div>

      <div class="links">
        <p>Don't have an account? <a routerLink="/register">Create Account</a></p>
      </div>
    </div>
  `,
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  message = '';
  success = false;
  returnUrl: string;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private loginApi: LoginApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // If already logged in, redirect
    if (this.loginApi.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.message = '';
      
      this.loginApi.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.success = response.success;
          if (response.success) {
            // Small delay to ensure token is saved before redirect
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 100);
          } else {
            this.message = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.success = false;
          this.message = error.message || 'An error occurred during login';
          console.error('Login error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
} 