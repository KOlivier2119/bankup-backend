import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

class UploadService {
    async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result as UploadApiResponse);
                }
            }).end(file.buffer);
        });
    }

    async uploadMultipleFiles(files: Express.Multer.File[]): Promise<UploadApiResponse[]> {
        const uploadPromises = files.map(file => this.uploadToCloudinary(file));
        return Promise.all(uploadPromises);
    }

    async uploadFilesByFields(files: { [fieldname: string]: Express.Multer.File[] }): Promise<{ [fieldname: string]: UploadApiResponse[] }> {
        const uploadResults: { [fieldname: string]: UploadApiResponse[] } = {};
        for (const fieldname in files) {
            uploadResults[fieldname] = await this.uploadMultipleFiles(files[fieldname]);
        }
        return uploadResults;
    }

    // Additional methods can be added here
}

export const uploadService = new UploadService();
