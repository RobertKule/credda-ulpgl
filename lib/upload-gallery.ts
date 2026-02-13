import { v2 as cloudinary } from "cloudinary";

// Ensure cloudinary is configured, even on client-side functions if needed, 
// though direct client uploads usually use signed signatures or unauthenticated presets.
// This utility can be used for server-side optimization and generic upload functions.

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = "credda/gallery") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};
