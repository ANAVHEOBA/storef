import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VideoUploadService } from '../../../lib/upload/api';
import { VideoUploadRequest } from '../../../lib/upload/types';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="upload-container">
      <h1>Upload Video</h1>
      
      <div class="upload-form" *ngIf="!isUploading">
        <div class="upload-box" 
             (dragover)="onDragOver($event)" 
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)"
             [class.drag-over]="isDragging">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Drag and drop video files to upload</p>
          <p>or</p>
          <input type="file" 
                 #fileInput 
                 (change)="onFileSelected($event)"
                 accept="video/*"
                 style="display: none">
          <button class="select-button" (click)="fileInput.click()">SELECT FILE</button>
        </div>

        <div class="form-group" *ngIf="selectedFile">
          <h2>Video Details</h2>
          <div class="input-group">
            <label>Title</label>
            <input type="text" [(ngModel)]="uploadData.title" placeholder="Enter video title">
          </div>
          
          <div class="input-group">
            <label>Description</label>
            <textarea [(ngModel)]="uploadData.description" 
                      placeholder="Enter video description"
                      rows="3"></textarea>
          </div>
          
          <div class="input-group">
            <label>Tags (comma separated)</label>
            <input type="text" [(ngModel)]="uploadData.tags" 
                   placeholder="Enter tags, e.g., music,gaming,tutorial">
          </div>
          
          <div class="input-group">
            <label>Visibility</label>
            <select [(ngModel)]="uploadData.visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div class="selected-file">
            <p>Selected: {{ selectedFile.name }}</p>
            <button class="upload-button" (click)="startUpload()">UPLOAD</button>
          </div>
        </div>
      </div>

      <div class="upload-progress" *ngIf="isUploading">
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" [style.width.%]="uploadProgress"></div>
          </div>
          <p>{{ uploadStatus }}</p>
          <button *ngIf="canCancel" class="cancel-button" (click)="cancelUpload()">Cancel</button>
        </div>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  uploadData: VideoUploadRequest = {
    file: null as any,
    title: '',
    description: '',
    tags: '',
    visibility: 'public'
  };

  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadStatus = '';
  errorMessage = '';
  isDragging = false;
  canCancel = false;
  currentVideoId: string | null = null;

  constructor(private uploadService: VideoUploadService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  handleFileSelection(file: File) {
    const validation = this.uploadService.validateVideoFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Invalid file';
      return;
    }

    this.selectedFile = file;
    this.uploadData.file = file;
    this.errorMessage = '';
  }

  startUpload() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    if (!this.uploadData.title.trim()) {
      this.errorMessage = 'Please enter a title';
      return;
    }

    this.isUploading = true;
    this.canCancel = true;
    this.uploadStatus = 'Uploading...';
    this.errorMessage = '';

    this.uploadService.uploadVideo(this.uploadData).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentVideoId = response.videoId!;
          this.uploadStatus = 'Processing video...';
          this.monitorProcessingStatus(response.videoId!);
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = 'Upload failed: ' + (error.message || 'Unknown error');
        this.canCancel = false;
      }
    });
  }

  cancelUpload() {
    if (this.currentVideoId) {
      this.uploadService.cancelProcessing(this.currentVideoId).subscribe({
        next: () => {
          this.resetUpload();
          this.uploadStatus = 'Upload cancelled';
        },
        error: () => {
          this.errorMessage = 'Failed to cancel upload';
        }
      });
    }
    this.resetUpload();
  }

  private monitorProcessingStatus(videoId: string) {
    const statusCheck = setInterval(() => {
      this.uploadService.getProcessingStatus(videoId).subscribe({
        next: (response) => {
          if (!response.success) {
            this.errorMessage = response.error || 'Processing failed';
            this.isUploading = false;
            this.canCancel = false;
            clearInterval(statusCheck);
            return;
          }

          switch (response.status) {
            case 'completed':
              this.uploadStatus = 'Upload complete!';
              this.uploadProgress = 100;
              this.canCancel = false;
              clearInterval(statusCheck);
              
              // Get metadata after completion
              this.uploadService.getVideoMetadata(videoId).subscribe({
                next: (metadataResponse) => {
                  if (metadataResponse.success) {
                    console.log('Video metadata:', metadataResponse.metadata);
                    // You can use metadata here if needed
                  }
                  setTimeout(() => this.resetUpload(), 2000);
                },
                error: () => {
                  console.error('Failed to fetch video metadata');
                  setTimeout(() => this.resetUpload(), 2000);
                }
              });
              break;
            case 'processing':
              this.uploadStatus = 'Processing video...';
              this.uploadProgress = 50; // Since we don't get actual progress
              break;
            case 'failed':
              this.errorMessage = response.error || 'Processing failed';
              this.isUploading = false;
              this.canCancel = false;
              clearInterval(statusCheck);
              break;
          }
        },
        error: (error) => {
          clearInterval(statusCheck);
          this.errorMessage = error.message || 'Failed to get processing status';
          this.isUploading = false;
          this.canCancel = false;
        }
      });
    }, 2000);
  }

  private resetUpload() {
    this.isUploading = false;
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadStatus = '';
    this.currentVideoId = null;
    this.uploadData = {
      file: null as any,
      title: '',
      description: '',
      tags: '',
      visibility: 'public'
    };
  }
} 