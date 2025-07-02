import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommentApiService } from '../../../../lib/comment/api';
import { LoginApiService } from '../../../../lib/login/api';
import { ProfileApiService } from '../../../../lib/profile/api';
import { Comment, Pagination } from '../../../../lib/comment/types';
import { ProfileUser } from '../../../../lib/profile/types';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() videoId!: string;
  
  commentForm: FormGroup;
  comments: Comment[] = [];
  pagination: Pagination | null = null;
  isLoading = false;
  commentsVisible = true;
  editingCommentId: string | null = null;
  updatingCommentId: string | null = null;
  currentUser: ProfileUser | null = null;
  
  constructor(
    private fb: FormBuilder,
    private commentApi: CommentApiService,
    private loginApi: LoginApiService,
    private profileApi: ProfileApiService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loadUserProfile();
    }
    this.loadComments();
  }
  
  loadComments(page: number = 1): void {
    this.isLoading = true;
    this.commentApi.getComments(this.videoId, page).subscribe({
      next: (response) => {
        if (response.success) {
          if (page === 1) {
            this.comments = response.comments;
          } else {
            this.comments = [...this.comments, ...response.comments];
          }
          this.pagination = response.pagination;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Handle error state
      }
    });
  }

  loadUserProfile() {
    this.profileApi.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.currentUser = response.user;
        }
      },
      error: () => {
        this.currentUser = null;
      }
    });
  }

  getUserInitial(user: ProfileUser | null): string {
    return user?.username?.charAt(0)?.toUpperCase() || 'U';
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  isLoggedIn(): boolean {
    return this.loginApi.isLoggedIn();
  }

  toggleCommentsVisibility(): void {
    this.commentsVisible = !this.commentsVisible;
  }

  enableEditing(comment: Comment): void {
    this.editingCommentId = comment._id;
  }

  cancelEditing(): void {
    this.editingCommentId = null;
  }

  saveComment(comment: Comment): void {
    if (!comment.content.trim()) {
      return;
    }
    
    this.updatingCommentId = comment._id;

    this.commentApi.updateComment(comment._id, { content: comment.content }).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.comments.findIndex(c => c._id === comment._id);
          if (index > -1) {
            this.comments[index].content = response.comment.content;
            this.comments[index].updatedAt = response.comment.updatedAt;
          }
          this.editingCommentId = null;
        }
        this.updatingCommentId = null;
      },
      error: () => {
        this.updatingCommentId = null;
        // Optionally, show an error message to the user
      }
    });
  }

  deleteComment(commentId: string): void {
    // For now, we'll just remove the comment locally.
    // In a real app, you would call an API to delete the comment.
    this.comments = this.comments.filter(c => c._id !== commentId);
  }

  onSubmit(): void {
    if (this.commentForm.invalid || !this.isLoggedIn()) {
      return;
    }

    this.isLoading = true;
    const { content } = this.commentForm.value;

    this.commentApi.addComment(this.videoId, { content }).subscribe({
      next: (response) => {
        if (response.success && this.currentUser) {
          const newComment: Comment = {
            ...response.comment,
            userId: {
              _id: this.currentUser.id,
              username: this.currentUser.username
            }
          };
          this.comments.unshift(newComment);
          this.commentForm.reset();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Handle error state
      }
    });
  }
} 