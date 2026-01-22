import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { DB_PREFIX } from '../config/db';

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUser extends IUserMethods {
  username: string;
  email: string;
  pwd: string;
  role: 'Admin' | 'User';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  pwd: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  avatar: { type: String },
}, { timestamps: true, collection: `${DB_PREFIX}users` });

userSchema.pre('save', async function (next) {
  if (!this.isModified('pwd')) return next();
  const salt = await bcrypt.genSalt(12);
  this.pwd = await bcrypt.hash(this.pwd, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.pwd);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;

// update 2026-01-22 09:00:28
