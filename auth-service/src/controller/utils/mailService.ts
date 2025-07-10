import { User } from "../../models/User";
import { OtpToken } from "../../models/OtpToken";
import nodemailer from "nodemailer";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
};

export const sendOtpToEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, message: "No user found with that email" };
  }

  // Optional: Check for recent unused OTP
  const existingOtp = await OtpToken.findOne({ email, used: false });
  if (existingOtp && existingOtp.expiresAt > new Date()) {
    return { success: false, message: "Please wait to resend OTP" };
  }

  // Generate and store new OTP
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 5 min

  await OtpToken.create({ email, otp, expiresAt });

  // Send email

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // smtp.gmail.com
    port: Number(process.env.EMAIL_PORT), // 587
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hmmbo Studios" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP",
    html: `<p>Your verification OTP is:</p><h2>${otp}</h2><p>It will expire in 5 minutes.</p>`,
  });

  return { success: true, message: "OTP sent to email." };
};
