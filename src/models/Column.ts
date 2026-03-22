import mongoose from 'mongoose';
import { DB_PREFIX } from '../config/db';

interface IColumn {
  title: string;
  board: mongoose.Types.ObjectId;
  order: number;
  wipLimit?: number;
  tasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new mongoose.Schema<IColumn>({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  order: { type: Number, required: true, default: 0 },
  wipLimit: { type: Number, min: 1, max: 50 },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true, collection: `${DB_PREFIX}columns` });

const Column = mongoose.model<IColumn>('Column', columnSchema);
export default Column;

// update 2026-03-22 10:21:52
