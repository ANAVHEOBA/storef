import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterApiService } from '../../../../lib/register/api';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="verify-email">
      <h2>Verify Your Email</h2>
      <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="code">Enter Verification Code</label>
          <input 
            type="text" 
            id="code"
            formControlName="code"
            placeholder="Enter the code sent to your email"
          >
          <div class="error" *ngIf="verifyForm.get('code')?.errors?.['required'] && verifyForm.get('code')?.touched">
            Verification code is required
          </div>
        </div>
        <button type="submit" [disabled]="verifyForm.invalid || isLoading">
          {{ isLoading ? 'Verifying...' : 'Verify Email' }}
        </button>
      </form>
      <div class="message" *ngIf="message" [class.error]="!success">
        {{ message }}
      </div>
    </div>
  `,
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmailComponent implements OnInit {
  verifyForm: FormGroup;
  isLoading = false;
  message = '';
  success = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private registerApi: RegisterApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Get email from route query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      if (!this.email) {
        this.router.navigate(['/register']);
      }
    });
  }

  onSubmit() {
    if (this.verifyForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.message = '';
      
      this.registerApi.verifyEmail({
        email: this.email,
        code: this.verifyForm.get('code')?.value
      }).subscribe({
        next: (response) => {
          this.success = response.success;
          this.message = response.message;
          if (response.success) {
            // Redirect to login after successful verification
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (error) => {
          this.success = false;
          this.message = error.message;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
} 