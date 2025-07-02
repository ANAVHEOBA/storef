import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { LoginApiService } from '../../../../lib/login/api';
import { ProfileApiService } from '../../../../lib/profile/api';
import { ProfileUser } from '../../../../lib/profile/types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-overlay" *ngIf="isOpen" (click)="closeSidebar()"></div>
    <div class="sidebar" [class.open]="isOpen">
      <div class="sidebar-header">
        <h3>Menu</h3>
        <button class="close-button" (click)="closeSidebar()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="sidebar-content">
        <!-- Navigation Links -->
        <div class="nav-section">
          <a routerLink="/" class="nav-link" (click)="closeSidebar()">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a routerLink="/dashboard/upload" class="nav-link" (click)="closeSidebar()">
            <i class="fas fa-upload"></i>
            <span>Upload</span>
          </a>
        </div>

        <!-- Authentication Section -->
        <div class="auth-section">
          <div *ngIf="!isLoggedIn()" class="auth-options">
            <h4>Sign In</h4>
            <button class="auth-button login" (click)="navigateToLogin()">
              <i class="fas fa-sign-in-alt"></i>
              <span>Sign In</span>
            </button>
            <button class="auth-button register" (click)="navigateToRegister()">
              <i class="fas fa-user-plus"></i>
              <span>Create Account</span>
            </button>
          </div>
          
          <div *ngIf="isLoggedIn()" class="user-section">
            <div class="user-info">
              <div class="user-avatar">
                {{ getUserInitial() }}
              </div>
              <div class="user-details">
                <span class="username">{{ currentUser?.username || 'User' }}</span>
                <span class="email">{{ currentUser?.email }}</span>
              </div>
            </div>
            <div class="user-actions">
              <button class="nav-link" (click)="navigateToDashboard()">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </button>
              <a routerLink="/dashboard/my-videos" class="nav-link" (click)="closeSidebar()">
                <i class="fas fa-video"></i>
                <span>My Videos</span>
              </a>
              <a routerLink="/dashboard/upload" class="nav-link" (click)="closeSidebar()">
                <i class="fas fa-upload"></i>
                <span>Upload Video</span>
              </a>
              <button class="auth-button logout" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  currentUser: ProfileUser | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private loginApi: LoginApiService,
    private profileApi: ProfileApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.sidebarService.sidebarOpen$.subscribe(isOpen => {
        console.log('Sidebar state changed:', isOpen);
        this.isOpen = isOpen;
      })
    );
    
    this.loadUserProfile();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadUserProfile() {
    if (this.isLoggedIn()) {
      this.profileApi.getProfile().subscribe({
        next: (response: any) => {
          if (response.success) {
            this.currentUser = response.user;
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  closeSidebar() {
    this.sidebarService.setSidebarOpen(false);
  }

  isLoggedIn(): boolean {
    return this.loginApi.isLoggedIn();
  }

  getCurrentUser(): ProfileUser | null {
    return this.currentUser;
  }

  getUserInitial(): string {
    return this.currentUser?.username?.charAt(0)?.toUpperCase() || 'U';
  }

  navigateToLogin() {
    console.log('Navigating to login...');
    this.closeSidebar();
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    console.log('Navigating to register...');
    this.closeSidebar();
    this.router.navigate(['/register']);
  }

  logout() {
    console.log('Logging out...');
    this.loginApi.logout();
    this.currentUser = null;
    this.closeSidebar();
    this.router.navigate(['/']);
  }

  navigateToDashboard() {
    console.log('Navigating to dashboard...');
    console.log('Is logged in:', this.isLoggedIn());
    console.log('Current user:', this.currentUser);
    this.closeSidebar();
    this.router.navigate(['/dashboard']);
  }
} 