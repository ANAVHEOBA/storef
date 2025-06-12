import { Video, VideoInput, IVideo } from './video.model';

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

