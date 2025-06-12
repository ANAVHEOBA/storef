import { IVideo, VideoInput, VideoStatus, Video } from './video.model';

export const createVideo = async (data: VideoInput): Promise<IVideo> => {
    const video = new Video(data);
    return await video.save();
};

export const getVideoById = async (videoId: string): Promise<IVideo | null> => {
    return await Video.findById(videoId);
};

export const getVideosByUserId = async (userId: string): Promise<IVideo[]> => {
    return await Video.find({ userId });
};

export const updateVideoStatus = async (
    videoId: string,
    status: VideoStatus
): Promise<IVideo | null> => {
    return await Video.findByIdAndUpdate(
        videoId,
        { status },
        { new: true }
    );
};

export const updateVideo = async (
    videoId: string,
    data: Partial<VideoInput>
): Promise<IVideo | null> => {
    return await Video.findByIdAndUpdate(
        videoId,
        { $set: data },
        { new: true }
    );
};

export const deleteVideo = async (videoId: string): Promise<IVideo | null> => {
    return await Video.findByIdAndDelete(videoId);
};
