import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Video } from '../../../../lib/video/types';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.html',
  styleUrls: ['./video-card.scss']
})
export class VideoCardComponent {
  @Input() video!: Video;

  constructor(private router: Router) {}

  /**
   * Navigate to video player when card is clicked
   */
  onVideoClick() {
    this.router.navigate(['/video', this.video.id]);
  }

  /**
   * Gets the full thumbnail URL using the base URL from environment
   */
  getThumbnailUrl(): string {
    if (!this.video.thumbnail) return '';
    // Extract base URL from environment.apiUrl by removing '/api'
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${this.video.thumbnail}`;
  }

  /**
   * Formats the duration in seconds to MM:SS format
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Formats the view count with appropriate suffix (K, M, etc)
   */
  formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }
}
