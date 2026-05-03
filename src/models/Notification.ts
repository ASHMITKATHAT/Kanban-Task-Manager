import mongoose from 'mongoose';
import { DB_PREFIX } from '../config/db';

export interface INotification {
  recipient: mongoose.Types.ObjectId;
  type: 'assignment' | 'comment' | 'mention' | 'deadline' | 'priority_change' | 'status_change' | 'board_invite';
  title: string;
  message: string;
  task?: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['assignment', 'comment', 'mention', 'deadline', 'priority_change', 'status_change', 'board_invite'],
    required: true,
  },
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 1000 },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: `${DB_PREFIX}notifications` });

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;

// update 2026-05-03 13:39:38
