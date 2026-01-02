import mongoose from 'mongoose';
import { DB_PREFIX } from '../config/db';

interface IBoard {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  columns: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new mongoose.Schema<IBoard>({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
}, { timestamps: true, collection: `${DB_PREFIX}boards` });

const Board = mongoose.model<IBoard>('Board', boardSchema);
export default Board;
