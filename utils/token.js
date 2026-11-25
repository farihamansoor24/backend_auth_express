import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Generate JWT token
export const generateToken = (user,expireIn) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: expireIn });
}