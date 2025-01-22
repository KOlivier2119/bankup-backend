import express, { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import upload from "../../middleware/multer";
import  * as authValidators from "../../validators/auth";
import { AuthController } from "../../controllers/authController";

const router: Router = express.Router();

router.post(
  "/register",
  upload.fields([
      { name: "idImage", maxCount: 1 }, // Single file for idImage
      { name: "profileImage", maxCount: 1 }, // Single file for profileImage
    ]),
    authValidators.validateRegister,
    AuthController.register
);

router.post('/login/email', authValidators.validateLoginWithEmail, AuthController.loginWithEmail);
// //@ts-ignore
// router.post('/login/phone', AuthController.loginWithPhone);

router.post('/verify/email', authValidators.validateVerifyEmailCode, AuthController.verifyEmailCode);
// //@ts-ignore
// router.post('/verify/phone', AuthController.verifyPhoneOTP);

router.post('/reset-password', authValidators.validateResetPassword, AuthController.resetPassword);

router.post('/set-new-password', authValidators.validateSetNewPassword, AuthController.setNewPassword);

export default router;
