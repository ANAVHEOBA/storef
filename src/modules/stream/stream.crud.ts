import { Stream } from './stream.schema';
import { IStream, IStreamChunk } from './stream.model';

export const createStream = async (userId: string): Promise<IStream> => {
    const stream = new Stream({ userId });
    return stream.save();
};

export const getStreamById = async (streamId: string): Promise<IStream | null> => {
    return Stream.findById(streamId);
};

export const addChunkToStream = async (streamId: string, chunk: IStreamChunk): Promise<IStream | null> => {
    return Stream.findByIdAndUpdate(
        streamId,
        { $push: { chunks: chunk } },
        { new: true }
    );
};

export const updateStreamStatus = async (streamId: string, status: string): Promise<IStream | null> => {
    return Stream.findByIdAndUpdate(streamId, { status }, { new: true });
};

export const finalizeStream = async (streamId: string, finalManifestUrl: string): Promise<IStream | null> => {
    return Stream.findByIdAndUpdate(
        streamId,
        { 
            status: 'finished',
            finalManifestUrl
        },
        { new: true }
    );
};

