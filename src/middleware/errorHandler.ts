import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    res.status(400).json({ message: err.message });
    return;
}
if(err instanceof Error) {
  res.status(400).json({ message: err.message });
    return;
}

  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

export default errorHandler;

