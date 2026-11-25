import mongoose from "mongoose";    
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  contact: { type: String },
  address: { type: String },
  gender: { type: String },
  country: { type: String }
},{ timestamps: true});

// Hash password before saving user to database
userSchema.pre('save',  async function() {
  if (!this.isModified('password')) return;

  try {
    // 1. Generate Salt
    const salt = await bcrypt.genSalt(10);
    
    //  Convert password to hash
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model('User', userSchema);
export default User;