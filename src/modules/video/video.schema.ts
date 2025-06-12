import Joi from 'joi';

export const uploadSchema = {
    body: Joi.object({
        file: Joi.any().required()
    })
};

export const videoIdSchema = {
    params: Joi.object({
        videoId: Joi.string().required()
    })
};

export const updateVideoSchema = {
    params: Joi.object({
        videoId: Joi.string().required()
    }),
    body: Joi.object({
        status: Joi.string().valid('processing', 'completed', 'failed'),
        metadata: Joi.object({
            duration: Joi.number(),
            size: Joi.number(),
            resolutions: Joi.array().items(Joi.string())
        }),
        files: Joi.object({
            original: Joi.string(),
            thumbnail: Joi.string(),
            processed: Joi.array().items(
                Joi.object({
                    resolution: Joi.string(),
                    path: Joi.string()
                })
            )
        })
    })
};
