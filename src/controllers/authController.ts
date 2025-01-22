import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EmailService } from '../services/emailService';
import { generateOTP, storeOTP, verifyOTP } from '../services/otpService';
import { jwtSecret, salt_round } from '../config';
import { AuthService } from '../services/authService';
import { registerType } from '../validators/auth';
import { UserService } from '../services/userService';
import { uploadService } from '../services/uploadService';
import { generateToken } from '../helpers/jwtToken';

export class AuthController {
  static async register(req: Request, res: Response) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
      const body: registerType = req.body;

      // Check if the user already exists
      const existingUser = await UserService.getUserByEmail(body.email);
      if (existingUser) {
        res.status(409).json({ message: 'User already exists' });
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, salt_round);
      body.password = hashedPassword;

      // Upload files to Cloudinary
      const uploadResults = await uploadService.uploadFilesByFields(files);
      const idImageUpload = uploadResults["idImage"][0];
      const profileImageUpload = uploadResults["profileImage"][0];

      // Create a new user
      const newUser = await AuthService.registerWithEmail(body, idImageUpload, profileImageUpload);

      // Send verification email
      const verificationCode = generateOTP();
      await storeOTP(newUser.id, verificationCode);
      await EmailService.sendVerificationEmail(newUser.email, verificationCode);
      
      // Respond with success
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  }

  
static async loginWithEmail(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const verificationCode = generateOTP();
    
    await storeOTP(user.id, verificationCode);
    await EmailService.sendVerificationEmail(user.email, verificationCode);


    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.log(error)
  }
};

// export const loginWithPhone = async (req: Request, res: Response) => {
//   try {
//     const { phoneNumber, password } = req.body;

//     const user = await User.findByPhoneNumber(phoneNumber);
//     if (!user) {
//       res.status(400).json({ message: 'Invalid credentials' });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       res.status(400).json({ message: 'Invalid credentials' });
//       return;
//     }

//     const otp = generateOTP();
//     await storeOTP(user.id, otp);
//     await sendOTP(user.phoneNumber, otp);

//     res.status(200).json({ message: 'OTP sent to phone number' });
//   } catch (error) {
//     console.log(error)
//   }
// };

static async verifyEmailCode(req: Request, res: Response) {
  try {
    const { email, verificationCode } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isValid = await verifyOTP(user.id, verificationCode.toString());
    if (!isValid) {
      res.status(400).json({ message: 'Invalid or expired verification code' });
      return;
    }

    const token = generateToken({ userId: user.id });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error occurred!' });
  }
};

// export const verifyPhoneOTP = async (req: Request, res: Response) => {
//   try {
//     const { phoneNumber, otp } = req.body;

//     const user = await User.findByPhoneNumber(phoneNumber);
//     if (!user) {
//       res.status(400).json({ message: 'User not found' });
//       return;
//     }

//     const isValid = await verifyOTP(user.id, otp);
//     if (!isValid) {
//       res.status(400).json({ message: 'Invalid or expired OTP' });
//       return;
//     }

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     console.log(error)
//   }
// };

static async resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const resetToken = generateToken({ userId: user.id }, '10m');
    console.log(resetToken);
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await EmailService.sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.log(error)
  }
};

//! This controller needs to be improved, it is not secure enough
static async setNewPassword(req: Request, res: Response) {
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }
    if ((await bcrypt.compare(newPassword, user.password))) {
      res.status(400).json({ message: 'New password must be different from the old password' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, salt_round);

    await UserService.updateUser(userId, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

}


