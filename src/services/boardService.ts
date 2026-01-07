import Board from '../models/Board';
import Column from '../models/Column';

interface BoardData {
  title: string;
  description?: string;
  owner: string;
}

interface UpdateBoardData {
  title?: string;
  description?: string;
}

interface ColumnData {
  title: string;
  board: string;
  order?: number;
  wipLimit?: number;
}

const getAllBoards = async () => {
  return Board.find({}).populate('owner', 'username email').populate('members', 'username email').populate('columns');
};

const getBoardById = async (id: string) => {
  return Board.findById(id)
    .populate('owner', 'username email')
    .populate('members', 'username email')
    .populate({ path: 'columns', options: { sort: { order: 1 } }, populate: { path: 'tasks', options: { sort: { order: 1 } } } });
};

const createBoard = async (data: BoardData) => {
  const board = new Board({ ...data, owner: data.owner, members: [data.owner] });
  await board.save();

  const defaultColumns = [
    { title: 'To Do', board: board._id, order: 0 },
    { title: 'In Progress', board: board._id, order: 1 },
    { title: 'Review', board: board._id, order: 2 },
    { title: 'Done', board: board._id, order: 3 },
  ];
  const columns = await Column.insertMany(defaultColumns);
  board.columns = columns.map(c => c._id);
  await board.save();

  return board.populate(['owner', 'columns']);
};

const updateBoard = async (id: string, data: UpdateBoardData) => {
  return Board.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('owner', 'username email')
    .populate('members', 'username email')
    .populate('columns');
};

const deleteBoard = async (id: string) => {
  const board = await Board.findById(id);
  if (!board) return false;
  await Column.deleteMany({ board: id });
  await Board.deleteOne({ _id: id });
  return true;
};

const addColumn = async (data: ColumnData) => {
  const column = new Column(data);
  await column.save();
  await Board.findByIdAndUpdate(data.board, { $push: { columns: column._id } });
  return column;
};

const updateColumn = async (id: string, data: Partial<ColumnData>) => {
  return Column.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteColumn = async (id: string) => {
  const column = await Column.findById(id);
  if (!column) return false;
  await Board.findByIdAndUpdate(column.board, { $pull: { columns: id } });
  await Column.deleteOne({ _id: id });
  return true;
};

const addMember = async (boardId: string, userId: string) => {
  return Board.findByIdAndUpdate(boardId, { $addToSet: { members: userId } }, { new: true }).populate('members', 'username email');
};

const removeMember = async (boardId: string, userId: string) => {
  return Board.findByIdAndUpdate(boardId, { $pull: { members: userId } }, { new: true }).populate('members', 'username email');
};

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
  addMember,
  removeMember,
};
