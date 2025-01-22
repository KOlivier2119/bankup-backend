import {z} from 'zod';
import {Request, Response, NextFunction} from 'express';
import { formatZodError } from '../helpers';

const roleSchema = z.object({
  name: z.string({
    required_error: 'Role name is required',
    message: 'Role name must be a string',
  }).min(3, 'Role name must be at least 3 characters long')
  .max(20, 'Role name must not be more than 20 characters long')
  .transform((data) => data.trim().toLowerCase().replace(" ", "_")),
});

export type createRoleType = z.infer<typeof roleSchema>;

export const validateRole = (req:Request, res:Response, next:NextFunction) => {
    try {
        const parsedData = roleSchema.parse(req.body);
        req.body = parsedData;
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({
            message: `Validation error: ${formatZodError(error)}`,
          });
          return;
        }
        res.status(500).json({ message: 'Internal server error' });
      }
}
