import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import emailSender from "../utils/email.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = new User(req.body);
    await newUser.save();

    const token = generateToken(newUser, "1h");
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------- Login User -----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = generateToken(user, "1h");

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------- Forgot Password -----------
export const fogotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const token = generateToken(user._id, "1h");
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await emailSender({
      to: user.email,
      subject: "Password Reset Request",
      html: `<h3>Click the link given below to reset your password:</h3>
      <a href="${resetUrl}" target="_blank">Reset Password</a>`,
    });

    return res.status(200).json({ success: true, message: "Password reset email sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, message: "Error sending email" });
  }
};

// --------- Reset Password -----------
export const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------- Profile -----------
export const profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};