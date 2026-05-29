import mongoose from 'mongoose';
import { DB_PREFIX } from '../config/db';

interface IUser {
  username: string;
  email: string;
  role: 'Admin' | 'User';
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    required: true,
    default: 'User',
  },
}, {
  collection: `${DB_PREFIX}users`
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
