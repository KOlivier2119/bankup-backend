import nodemailer from 'nodemailer';
import { email_password, email_service, email_user } from '../config';

export class EmailService {

static async sendEmail (
  to: string,
  subject: string,
  htmlTemplate: string,
  text?: string,
) {
  const transporter = nodemailer.createTransport({
   service: email_service,
    auth: {
      user: email_user,
      pass: email_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Bankup" ${email_user}`,
    to,
    subject,
    html: htmlTemplate,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Email not sent to ${to} \n ${error}`);
    }
    console.log('Email sent');
  });
};

static async sendVerificationEmail(to: string, code: string) {
  await this.sendEmail(
    to,
    'Email Verification',
    `<p>Your verification code is <strong>${code}</strong></p>`,
    `Your verification code is ${code}`,
  );
};

 static async sendPasswordResetEmail(to: string, resetLink: string) {
  await this.sendEmail(
    to,
    'Password Reset',
    `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    `Click this link to reset your password: ${resetLink}`);
};

 static async sendOTP(phoneNumber: string, otp: string) {
  // This is a placeholder for SMS sending functionality
  // You would typically use a service like Twilio or another SMS gateway here
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  // Implement your SMS sending logic here
};

}