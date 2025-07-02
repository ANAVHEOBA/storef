import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamApiService } from '../../../lib/stream/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  isStreaming = false;
  isLoading = false;
  error: string | null = null;
  streamId: string | null = null;
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  sequence = 0;

  constructor(
    private streamApi: StreamApiService,
    private router: Router
  ) {}

  async startPreview() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoPlayer.nativeElement.srcObject = this.mediaStream;
    } catch (err) {
      this.error = 'Could not access camera or microphone. Please check permissions.';
      console.error('Error accessing media devices.', err);
    }
  }

  startStreaming() {
    if (!this.mediaStream) {
      this.error = 'Camera is not active. Please start the camera first.';
      return;
    }

    this.isLoading = true;
    this.streamApi.startStream().subscribe({
      next: (response) => {
        if (response.success) {
          this.streamId = response.streamId;
          this.isStreaming = true;
          this.startRecording();
        } else {
          this.error = 'Failed to start stream.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'An unknown error occurred.';
        this.isLoading = false;
      }
    });
  }

  startRecording() {
    if (!this.mediaStream || !this.streamId) return;

    this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: 'video/webm; codecs=vp9' });
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.sequence++;
        this.streamApi.uploadChunk(this.streamId!, event.data, this.sequence).subscribe({
          next: (res) => console.log(`Chunk ${this.sequence} uploaded`, res),
          error: (err) => console.error(`Failed to upload chunk ${this.sequence}`, err)
        });
      }
    };

    this.mediaRecorder.start(5000); // Create a chunk every 5 seconds
  }

  stopStreaming() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
    
    if (this.streamId) {
      this.isLoading = true;
      this.streamApi.stopStream(this.streamId).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/video', response.videoId]);
          } else {
            this.error = 'Failed to finalize stream.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'An unknown error occurred.';
          this.isLoading = false;
        }
      });
    }

    this.isStreaming = false;
    this.streamId = null;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.videoPlayer.nativeElement.srcObject = null;
  }

  ngOnDestroy() {
    // Ensure all tracks are stopped when the component is destroyed
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
  }
} 