import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterApiService } from '../../../../lib/register/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  verificationCode: string | null = null;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private registerApi: RegisterApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { username, email, password } = this.registerForm.value;

    this.registerApi.register({ username, email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Store token in localStorage
          localStorage.setItem('token', response.token);
          this.verificationCode = response.verificationCode;
          // Navigate to verification page with email in query params
          this.router.navigate(['/verify-email'], {
            queryParams: { email }
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message;
      }
    });
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${controlName} is required`;
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['minlength']) {
      return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['pattern']) return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    if (controlName === 'confirmPassword' && this.registerForm.errors?.['mismatch']) {
      return 'Passwords do not match';
    }

    return '';
  }
}
