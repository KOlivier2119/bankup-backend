import "dotenv/config";
export * from "./redis";

export const port = parseInt(process.env.PORT || "3500");
export const salt_round = parseInt(process.env.SALT_ROUNDS || "8");
export const jwtSecret = String(process.env.JWT_SECRET);
export const node_env = process.env.NODE_ENV || 'development';
export const email_service = process.env.EMAIL_SERVICE || 'gmail';
export const email_user = String(process.env.EMAIL_USER);
export const email_password = String(process.env.EMAIL_PASSWORD);