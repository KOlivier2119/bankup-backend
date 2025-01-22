import multer from 'multer';
// import sharp from 'sharp';

// Set memory storage engine
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: async (req, file, cb) => {
        try {
            await validateFile(req, file, cb);
        } catch (err) {
            cb(err as Error);
        }
    }
});

// Check file type, size, and dimensions
async function validateFile(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Error: Only images are allowed.'));
    }

    // Check minimum file size (100KB)
    const MIN_FILE_SIZE = 100 * 1024;
    if (file.size < MIN_FILE_SIZE) {
        return cb(new Error('Error: File size is too small. Minimum size is 100KB.'));
    }

    // // Check dimensions
    // const image = sharp(file.buffer || file.stream);
    // const metadata = await image.metadata();
    // if ((metadata.width ?? 0) < 400 || (metadata.height ?? 0) < 400) {
    //     return cb(new Error('Error: Image dimensions should be at least 400x400.'));
    // }

    cb(null, true);
}

export default upload;
