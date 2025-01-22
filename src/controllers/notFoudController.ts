import { Request, Response } from 'express';

class NotFoundController {
    public static notFound(req: Request, res: Response): void {
        res.status(404).json({ message: `Api ${req.originalUrl} is not found` });
    }
}

export default NotFoundController;