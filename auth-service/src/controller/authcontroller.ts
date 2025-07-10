import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpToEmail } from "./utils/mailService";
import { OtpToken } from "../models/OtpToken";

// Helper to generate JWT
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
  });
};

// Helper to set cookie
const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600 * 1000, // 1 hour
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.isVerified) {
        res.status(400).json({ error: "Email already in use" });
        return;
      } else {
        // ✅ Overwrite unverified user
        await User.findOneAndDelete({ email });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      isVerified: false, // for clarity
    });
    await user.save();

    const otpResult = await sendOtpToEmail(email);
    if (!otpResult.success) {
      res.status(500).json({ error: otpResult.message });
      return;
    }

    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.status(201).json({
      message: "User registered. Please verify your email using the OTP sent.",
      username: user.username,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    if (!user.isVerified) {
      res
        .status(403)
        .json({ error: "Please verify your email before logging in" });
      return;
    }

    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.json({
      message: "Logged in successfully",
      username: user.username,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select(
      "email username profilePicUrl createdAt"
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Me Error:", err);
    res.status(500).json({ error: "Could not fetch user info" });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("email isVerified");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: "Email is already verified" });
      return;
    }

    const otpResult = await sendOtpToEmail(user.email);
    if (!otpResult.success) {
      res.status(500).json({ error: otpResult.message });
      return;
    }

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (err) {
    console.error("❌ Resend OTP Error:", err);
    res.status(500).json({ error: "Could not resend OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { otp } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!otp || typeof otp !== "string") {
      res.status(400).json({ error: "OTP is required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: "Email already verified" });
      return;
    }

    const validOtp = await OtpToken.findOne({
      email: user.email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!validOtp) {
      res.status(400).json({ error: "Invalid or expired OTP" });
      return;
    }

    // ✅ Mark user verified and OTP as used
    user.isVerified = true;
    await user.save();

    validOtp.used = true;
    await validOtp.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("❌ OTP Verify Error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
