import { Routes } from '@angular/router';
import { VideoGalleryComponent } from './features/video/video-gallery/video-gallery';
import { VideoPlayerComponent } from './features/video/video-player/video-player';
import { RegisterComponent } from './features/auth/register/register';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email';
import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { UploadComponent } from './features/upload/upload.component';
import { MyVideosComponent } from './features/dashboard/my-videos/my-videos';

export const routes: Routes = [
  {
    path: '',
    component: VideoGalleryComponent
  },
  {
    path: 'video/:id',
    component: VideoPlayerComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'my-videos',
        pathMatch: 'full'
      },
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'my-videos',
        component: MyVideosComponent
      },
      {
        path: 'settings',
        component: VideoGalleryComponent // Replace with actual settings component when ready
      }
    ]
  }
];
