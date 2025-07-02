import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileApiService } from '../../../lib/profile/api';
import { ProfileUser } from '../../../lib/profile/types';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ user?.username || 'User' }}!</p>
        </div>

      <div class="dashboard-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  user: ProfileUser | null = null;

  constructor(
    private profileApi: ProfileApiService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.loadProfile();
    }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  private loadProfile() {
    this.profileApi.getProfile().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.user = response.user;
        }
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
      }
    });
  }
} 