import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoApiService } from '../../../../lib/video/api';
import { Video } from '../../../../lib/video/types';
import { VideoCardComponent } from '../video-card/video-card';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  templateUrl: './video-gallery.html',
  styleUrls: ['./video-gallery.scss']
})
export class VideoGalleryComponent implements OnInit {
  videos: Video[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;

  constructor(private videoApi: VideoApiService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.isLoading = true;
    this.error = null;

    this.videoApi.getVideoGallery(this.currentPage).subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }
}
