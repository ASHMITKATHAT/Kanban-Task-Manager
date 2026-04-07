import mongoose from 'mongoose';
import { DB_PREFIX } from '../config/db';

export interface IAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

export interface IComment {
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeEntry {
  user: mongoose.Types.ObjectId;
  duration: number;
  description?: string;
  startedAt: Date;
  endedAt?: Date;
}

export interface ITask {
  title: string;
  description?: string;
  board: mongoose.Types.ObjectId;
  column: mongoose.Types.ObjectId;
  assignees: mongoose.Types.ObjectId[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  deadline?: Date;
  attachments: IAttachment[];
  comments: IComment[];
  timeTracking: ITimeEntry[];
  totalTimeSpent: number;
  estimatedHours?: number;
  order: number;
  checklist: { text: string; checked: boolean }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new mongoose.Schema<IAttachment>({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema<IComment>({
  content: { type: String, required: true, maxlength: 2000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const timeEntrySchema = new mongoose.Schema<ITimeEntry>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true, min: 0 },
  description: { type: String, maxlength: 500 },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date },
});

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 5000 },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  labels: [{ type: String, trim: true, maxlength: 50 }],
  deadline: { type: Date },
  attachments: [attachmentSchema],
  comments: [commentSchema],
  timeTracking: [timeEntrySchema],
  totalTimeSpent: { type: Number, default: 0, min: 0 },
  estimatedHours: { type: Number, min: 0 },
  order: { type: Number, default: 0 },
  checklist: [{ text: { type: String, maxlength: 500 }, checked: { type: Boolean, default: false } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: `${DB_PREFIX}tasks` });

taskSchema.index({ board: 1, column: 1, order: 1 });
taskSchema.index({ title: 'text', description: 'text', labels: 'text' });
taskSchema.index({ assignees: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ deadline: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;

// update 2026-02-03 16:08:44

// update 2026-03-07 17:26:20

// update 2026-04-07 14:52:47
