import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.scss']
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateToRegister() {
    this.close.emit();
    this.router.navigate(['/register']);
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.close.emit();
    this.router.navigate(['/login']);
  }
} 