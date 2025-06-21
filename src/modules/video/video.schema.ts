import { z } from 'zod';

export const uploadSchema = z.object({
    file: z.any()
});

export const videoIdSchema = z.object({
    videoId: z.string()
});

export const updateMetadataSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(5000).optional(),
    tags: z.array(z.string()).max(10).optional(),
    visibility: z.enum(['public', 'private']).optional()
});

export const videoQualitySchema = z.object({
    quality: z.string()
});

export const createCommentSchema = z.object({
    content: z.string().min(1).max(5000),
    parentCommentId: z.string().optional()
});

export const updateCommentSchema = z.object({
    content: z.string().min(1).max(5000)
});

export const commentIdSchema = z.object({
    commentId: z.string()
});
