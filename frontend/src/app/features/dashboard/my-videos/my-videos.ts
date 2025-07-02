import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyVideosApiService } from '../../../../lib/myvideo/api';
import { VideoDetails } from '../../../../lib/myvideo/types';
import { VideoCardComponent } from '../../video/video-card/video-card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  template: `
    <div class="my-videos-gallery">
      <h2>My Videos ({{ videos.length }} videos)</h2>
      @if (isLoading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your videos...</p>
        </div>
      } @else if (error) {
        <div class="error-state">
          <p>{{ error }}</p>
        </div>
      } @else if (videos.length > 0) {
        <div class="videos-grid">
          @for (video of videos; track video._id; let i = $index) {
            <div class="video-wrapper">
              <p>Video {{ i + 1 }}: {{ video.title }}</p>
              <app-video-card [video]="mapVideo(video)"></app-video-card>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>You haven't uploaded any videos yet.</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./my-videos.scss']
})
export class MyVideosComponent implements OnInit {
  videos: VideoDetails[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private myVideosApi: MyVideosApiService) {}

  ngOnInit() {
    this.loadMyVideos();
  }

  loadMyVideos() {
    this.isLoading = true;
    this.error = null;
    this.myVideosApi.getMyVideos().subscribe({
      next: (response) => {
        console.log('My videos response:', response);
        if (response.success) {
          this.videos = response.videos;
          console.log('Videos loaded:', this.videos.length);
          console.log('Videos data:', this.videos);
        } else {
          this.error = 'Failed to load videos.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.error = err.message || 'An error occurred while fetching your videos.';
        this.isLoading = false;
      }
    });
  }

  mapVideo(videoDetails: VideoDetails) {
    console.log('Mapping video:', videoDetails._id, videoDetails.title);
    const mappedVideo = {
      id: videoDetails._id,
      title: videoDetails.title,
      thumbnail: videoDetails.files?.thumbnail?.path || '',
      duration: videoDetails.metadata?.duration || 0,
      views: videoDetails.viewCount || 0,
      createdAt: videoDetails.createdAt,
      cdnUrl: videoDetails.files?.original?.cdnUrl || '',
      creator: videoDetails.userId
    };
    console.log('Mapped video:', mappedVideo);
    return mappedVideo;
  }
} 