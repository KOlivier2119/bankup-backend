import { Gender } from '@prisma/client';
import moment from 'moment';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { formatZodError } from '../helpers';

// Zod schema to validate the request body and files
const userRegistrationSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    fullName: z.string({ required_error: "Full name is required" })
        .min(3, "Full name must be at least 3 characters long")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Full name must contain only alphabetic words separated by spaces"),
    nationalIdNumber: z.string({ required_error: "National ID number is required" })
        .regex(/^1(19|20)\d{2}[78]\d{7}[0-2]\d{2}$/, "Invalid national ID number"),
    password: z.string({ required_error: "Password is required" })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must include at least one number' })
        .regex(/[@$!%*?&]/, { message: 'Password must include at least one special character (@$!%*?&)' }),
    phoneNumber: z.string({ required_error: "Phone number is required" })
        .regex(/^(?:\+2507|2507|07)[2389]\d{7}$/, "Invalid phone number")
        .transform((val) => val.startsWith('+25') ? val : `+25${val.replace(/^.*?(?=0)/, '')}`),
    address: z.string({ required_error: "Address is required" })
        .min(2, "Invalid address").max(255, "Address is too long"),
    dateOfBirth: z.coerce.date({ required_error: "Date of birth is required" })
        .min(moment().subtract(100, "years").toDate(), "Date of birth unacceptable")
        .max(moment().subtract(18, "years").toDate(), "You must be at least 18 years old"),
    gender: z.enum([Gender.male, Gender.female, Gender.other], { required_error: "Gender is required" }),
}).superRefine((data, ctx) => {
    const yearOfBirth = data.dateOfBirth.getFullYear().toString();
    const nationalIdYear = data.nationalIdNumber.slice(1, 5);
    if (yearOfBirth !== nationalIdYear) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "The year in the national ID number does not match the year in the provided date of birth",
            path: ["dateOfBirth"],
        });
    }
});


export type registerType = z.infer<typeof userRegistrationSchema>;

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        if (!files || !files["idImage"] || !files["profileImage"]) {
            res.status(400).json({ message: 'Please upload required files' });
            return;
        }

        if (!files["idImage"] || !files["idImage"].length) {
            res.status(400).json({ message: 'Please upload national id image' });
            return;
        }
        if (!files["profileImage"] || !files["profileImage"].length) {
            res.status(400).json({ message: 'Please upload the profile image' });
            return;
        }

        const parsedData = userRegistrationSchema.parse(req.body);
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

const loginWithEmailSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }),
});

export type loginWithEmailType = z.infer<typeof loginWithEmailSchema>;

export const validateLoginWithEmail = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = loginWithEmailSchema.parse(req.body);
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
};

const verifyEmailCodeSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    verificationCode: z.number({ required_error: "Verification code is required" }).positive("Invalid verification code"),
});

export type verifyEmailCodeType = z.infer<typeof verifyEmailCodeSchema>;

export const validateVerifyEmailCode = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = verifyEmailCodeSchema.parse(req.body);
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
};

const resetPasswordSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
});

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = resetPasswordSchema.parse(req.body);
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
};

const setNewPasswordSchema = z.object({
    newPassword: z.string({ required_error: "Password is required" })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must include at least one number' })
        .regex(/[@$!%*?&]/, { message: 'Password must include at least one special character (@$!%*?&)' }),
    resetToken: z.string({ required_error: "Reset token is required" }),
});

export type setNewPasswordType = z.infer<typeof setNewPasswordSchema>;

export const validateSetNewPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = setNewPasswordSchema.parse(req.body);
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
};