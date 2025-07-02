import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthModalComponent } from './features/auth/auth-modal/auth-modal';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { LoginApiService } from '../lib/login/api';
import { ProfileApiService } from '../lib/profile/api';
import { ProfileUser } from '../lib/profile/types';
import { SidebarService } from './shared/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    AuthModalComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  showMenu = false;
  showAuthModal = false;
  currentUser: ProfileUser | null = null;

  constructor(
    private router: Router,
    private loginApi: LoginApiService,
    private profileApi: ProfileApiService,
    private sidebarService: SidebarService
  ) {
    this.loadUserProfile();
  }

  loadUserProfile() {
    if (this.isLoggedIn()) {
      this.profileApi.getProfile().subscribe({
        next: (response) => {
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

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleDashboardSidebar() {
    console.log('Hamburger menu clicked!');
    console.log('Current sidebar state:', this.sidebarService.sidebarOpen$);
    this.sidebarService.toggleSidebar();
    console.log('Sidebar toggled');
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

  openAuthModal() {
    this.showAuthModal = true;
    this.showMenu = false;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  logout() {
    this.loginApi.logout();
    this.currentUser = null;
    this.showMenu = false;
    this.router.navigate(['/']);
  }

  navigateToRegister() {
    this.showAuthModal = false;
    this.router.navigate(['/register']);
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    this.showAuthModal = false;
    this.router.navigate(['/login']);
  }

  // App component logic here
}
