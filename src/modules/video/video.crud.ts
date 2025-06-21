import { Video, VideoInput, IVideo, Comment, IComment, Like } from './video.model';

export const createVideo = async (videoData: VideoInput): Promise<IVideo> => {
    const video = new Video(videoData);
    return await video.save();
};

export const getVideoById = async (id: string): Promise<IVideo | null> => {
    return await Video.findById(id);
};

export const getUserVideos = async (userId: string): Promise<IVideo[]> => {
    return await Video.find({ userId }).sort({ createdAt: -1 });
};

export const updateVideo = async (id: string, update: Partial<VideoInput>): Promise<IVideo | null> => {
    return await Video.findByIdAndUpdate(id, update, { new: true });
};

export const updateVideoStatus = async (id: string, status: string): Promise<IVideo | null> => {
    return await Video.findByIdAndUpdate(id, { status }, { new: true });
};

export const updateVideoMetadata = async (
    id: string, 
    metadata: { title?: string; description?: string; tags?: string[]; visibility?: 'public' | 'private' }
): Promise<IVideo | null> => {
    return await Video.findByIdAndUpdate(id, { $set: metadata }, { new: true });
};

export const deleteVideo = async (id: string): Promise<boolean> => {
    const result = await Video.deleteOne({ _id: id });
    return result.deletedCount === 1;
};

export const incrementViewCount = async (id: string): Promise<void> => {
    await Video.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
};

// --- Comment CRUD ---

export const createComment = async (
    userId: string,
    videoId: string,
    content: string,
    parentCommentId?: string
): Promise<IComment> => {
    const comment = new Comment({ userId, videoId, content, parentCommentId });
    await comment.save();

    await Video.findByIdAndUpdate(videoId, { $inc: { commentsCount: 1 } });

    return comment;
};

export const getCommentsByVideoId = async (
    videoId: string,
    page: number,
    limit: number
): Promise<{ comments: IComment[], total: number }> => {
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ videoId, parentCommentId: { $exists: false } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username'); 

    const total = await Comment.countDocuments({ videoId, parentCommentId: { $exists: false } });

    return { comments, total };
};

export const getCommentById = async (commentId: string): Promise<IComment | null> => {
    return Comment.findById(commentId);
};

export const updateComment = async (
    commentId: string,
    content: string
): Promise<IComment | null> => {
    return Comment.findByIdAndUpdate(commentId, { content }, { new: true });
};

// --- Like CRUD ---

export const toggleLike = async (
    userId: string,
    videoId: string
): Promise<{ liked: boolean; likesCount: number }> => {
    const existingLike = await Like.findOne({ userId, videoId });
    let liked = false;

    if (existingLike) {
        // User has already liked, so unlike
        await existingLike.deleteOne();
        await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: -1 } });
        liked = false;
    } else {
        // User has not liked, so like
        const newLike = new Like({ userId, videoId });
        await newLike.save();
        await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: 1 } });
        liked = true;
    }
    
    const video = await Video.findById(videoId).select('likesCount');
    return { liked, likesCount: video?.likesCount ?? 0 };
};

export const getLikesCount = async (videoId: string): Promise<number> => {
    const video = await Video.findById(videoId).select('likesCount');
    return video?.likesCount ?? 0;
};

