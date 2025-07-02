export interface User {
  _id: string;
  username: string;
}

// This is the main comment type, with a populated user object.
export interface Comment {
  _id: string;
  userId: User;
  videoId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// This represents the comment returned *only* from the POST endpoint,
// where the `userId` is just a string.
export interface NewComment {
  _id: string;
  userId: string;
  videoId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddCommentPayload {
  content: string;
}

export interface AddCommentResponse {
  success: boolean;
  comment: NewComment;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface UpdateCommentResponse {
  success: boolean;
  comment: NewComment;
}

export interface Pagination {
  current: number;
  total: number;
  hasMore: boolean;
}

export interface GetCommentsResponse {
  success: boolean;
  comments: Comment[];
  pagination: Pagination;
}

export interface ApiError {
  success: boolean;
  message: string;
} 