import crypto from 'crypto';
import { redis } from '../config';

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const storeOTP = async (userId: number, otp: string): Promise<void> => {
  const expiry = 10 * 60; // OTP expires in 10 minutes
  await redis.set(`otp:${userId}`, otp, 'EX', expiry);
};

export const verifyOTP = async (userId: number, otp: string): Promise<boolean> => {
  const storedOTP = await redis.get(`otp:${userId}`);
  if (!storedOTP) {
    return false;
  }

  if (storedOTP === otp) {
    await redis.del(`otp:${userId}`);
    return true;
  }

  return false;
};

