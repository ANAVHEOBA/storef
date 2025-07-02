import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfileApiService } from '../../../../lib/profile/api';
import { LoginApiService } from '../../../../lib/login/api';
import { ProfileUser } from '../../../../lib/profile/types';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-menu" *ngIf="isLoggedIn">
      <button class="profile-button" (click)="toggleMenu()">
        <div class="avatar">{{ getAvatarLetter() }}</div>
      </button>

      <div class="menu-dropdown" *ngIf="showMenu">
        <div class="user-info">
          <div class="avatar large">{{ getAvatarLetter() }}</div>
          <div class="details">
            <div class="username">{{ user?.username || 'User' }}</div>
            <div class="email">{{ user?.email || '' }}</div>
          </div>
        </div>
        
        <div class="menu-items">
          <a class="menu-item" routerLink="/dashboard" (click)="toggleMenu()">
            <i class="fas fa-th-large"></i>
            Dashboard
          </a>
          <a class="menu-item" routerLink="/profile" (click)="toggleMenu()">
            <i class="fas fa-user"></i>
            Your Channel
          </a>
          <a class="menu-item" routerLink="/settings" (click)="toggleMenu()">
            <i class="fas fa-cog"></i>
            Settings
          </a>
          <div class="divider"></div>
          <button class="menu-item" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile-menu.scss']
})
export class ProfileMenuComponent implements OnInit {
  isLoggedIn = false;
  showMenu = false;
  user: ProfileUser | null = null;

  constructor(
    private profileApi: ProfileApiService,
    private loginApi: LoginApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.loginApi.isLoggedIn();
    if (this.isLoggedIn) {
      this.loadProfile();
    }
  }

  loadProfile() {
    this.profileApi.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user;
        }
      },
      error: () => {
        // If profile fetch fails, log out user
        this.logout();
      }
    });
  }

  getAvatarLetter(): string {
    return this.user?.username?.charAt(0)?.toUpperCase() || 'U';
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.loginApi.logout();
    this.isLoggedIn = false;
    this.showMenu = false;
    this.router.navigate(['/']);
  }
} 
 
 