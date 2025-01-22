import { z } from 'zod';

export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => err.message).join(', ');
};
