import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Video } from '../../../../lib/video/types';
import { VideoApiService } from '../../../../lib/video/api';
import { CommentsComponent } from '../comments/comments.component';
import { LikeApiService } from '../../../../lib/like/api';
import { LoginApiService } from '../../../../lib/login/api';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './video-player.html',
  styleUrls: ['./video-player.scss']
})
export class VideoPlayerComponent implements OnInit {
  video?: Video;
  isLoading = true;
  error: string | null = null;
  isPlaying = false;
  currentTime = 0;
  volume = 1;
  isLiking = false;

  constructor(
    private route: ActivatedRoute,
    private videoApi: VideoApiService,
    private likeApi: LikeApiService,
    private loginApi: LoginApiService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get video ID from route parameter
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.loadVideo(videoId);
    }
  }

  /**
   * Load video data from API
   */
  private loadVideo(videoId: string) {
    this.isLoading = true;
    this.error = null;

    // Get video from the gallery response for now
    this.videoApi.getVideoGallery().subscribe({
      next: (response) => {
        this.video = response.videos.find(v => v.id === videoId);
        this.isLoading = false;
        if (!this.video) {
          this.error = 'Video not found';
        }
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggle video play/pause
   */
  togglePlay() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      if (this.isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  /**
   * Handle video time update
   */
  onTimeUpdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    this.currentTime = videoElement.currentTime;
  }

  /**
   * Handle volume change
   */
  onVolumeChange(value: number) {
    this.volume = value;
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.volume = value;
    }
  }

  toggleLike(): void {
    if (!this.loginApi.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    if (this.video && !this.isLiking) {
      this.isLiking = true;
      this.likeApi.likeVideo(this.video.id).subscribe({
        next: (response) => {
          if (response.success && this.video) {
            this.video.isLiked = response.liked;
            this.video.likes = response.likesCount;
          }
          this.isLiking = false;
        },
        error: () => {
          this.isLiking = false;
          // Optionally handle like error
        }
      });
    }
  }
}
