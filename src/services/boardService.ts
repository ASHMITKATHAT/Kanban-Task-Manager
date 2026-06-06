import Board from '../models/Board';
import { DB_PREFIX } from '../config/db';

interface BoardData {
  title: string;
  description?: string;
}

interface UpdateBoardData {
  title?: string;
  description?: string;
}

const getAllBoards = async (): Promise<Board[]> => {
  return Board.find({});
};

const getBoardById = async (id: string): Promise<Board | null> => {
  return Board.findById(id);
};

const createBoard = async (data: BoardData): Promise<Board> => {
  const board = new Board(data);
  await board.save();
  return board;
};

const updateBoard = async (id: string, data: UpdateBoardData): Promise<Board | null> => {
  return Board.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteBoard = async (id: string): Promise<boolean> => {
  const result = await Board.deleteOne({ _id: id });
  return result.deletedCount === 1;
};

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
