import Task, { ITask } from '../models/Task';
import Column from '../models/Column';
import Notification from '../models/Notification';

interface TaskFilter {
  board?: string;
  column?: string;
  priority?: string;
  assignee?: string;
  labels?: string;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
  page: number;
  limit: number;
  sort: string;
  order: string;
}

const getAllTasks = async (filter: TaskFilter) => {
  const query: any = {};
  if (filter.board) query.board = filter.board;
  if (filter.column) query.column = filter.column;
  if (filter.priority) query.priority = filter.priority;
  if (filter.assignee) query.assignees = filter.assignee;
  if (filter.labels) query.labels = { $in: filter.labels.split(',') };
  if (filter.search) {
    query.$or = [
      { title: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
    ];
  }
  if (filter.dueBefore || filter.dueAfter) {
    query.deadline = {};
    if (filter.dueBefore) query.deadline.$lte = new Date(filter.dueBefore);
    if (filter.dueAfter) query.deadline.$gte = new Date(filter.dueAfter);
  }

  const sortObj: any = {};
  sortObj[filter.sort] = filter.order === 'asc' ? 1 : -1;

  const total = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .sort(sortObj)
    .skip((filter.page - 1) * filter.limit)
    .limit(filter.limit)
    .populate('assignees', 'username email')
    .populate('createdBy', 'username')
    .populate('comments.author', 'username email');

  return { tasks, total, page: filter.page, limit: filter.limit, totalPages: Math.ceil(total / filter.limit) };
};

const getTaskById = async (id: string) => {
  return Task.findById(id)
    .populate('assignees', 'username email')
    .populate('createdBy', 'username email')
    .populate('comments.author', 'username email')
    .populate('attachments.uploadedBy', 'username');
};

const createTask = async (data: any, userId: string) => {
  const task = new Task({ ...data, createdBy: userId });
  await task.save();
  await Column.findByIdAndUpdate(data.column, { $push: { tasks: task._id } });

  if (data.assignees && data.assignees.length > 0) {
    const notifications = data.assignees.map((assigneeId: string) => ({
      recipient: assigneeId,
      type: 'assignment' as const,
      title: 'New Task Assignment',
      message: `You have been assigned to task: "${task.title}"`,
      task: task._id,
      board: data.board,
    }));
    await Notification.insertMany(notifications);
  }

  return task.populate(['assignees', 'createdBy']);
};

const updateTask = async (id: string, data: any, userId: string) => {
  const original = await Task.findById(id);
  if (!original) return null;

  const task = await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('assignees', 'username email')
    .populate('createdBy', 'username');

  if (data.column && data.column !== original.column?.toString()) {
    await Column.findByIdAndUpdate(original.column, { $pull: { tasks: id } });
    await Column.findByIdAndUpdate(data.column, { $push: { tasks: id } });
  }

  const changes: string[] = [];
  if (data.priority && data.priority !== original.priority) changes.push(`Priority changed to ${data.priority}`);
  if (data.column && data.column !== original.column?.toString()) changes.push('Moved to a different column');
  if (data.assignees) {
    const newAssignees = data.assignees.filter((a: string) => !original.assignees.map(a => a.toString()).includes(a));
    if (newAssignees.length > 0) {
      const notifications = newAssignees.map((assigneeId: string) => ({
        recipient: assigneeId,
        type: 'assignment' as const,
        title: 'Task Assignment Updated',
        message: `You have been assigned to task: "${task?.title || original.title}"`,
        task: id,
        board: data.board || original.board,
      }));
      await Notification.insertMany(notifications);
    }
  }

  if (changes.length > 0 && original.assignees.length > 0) {
    const notifications = original.assignees.map((assigneeId) => ({
      recipient: assigneeId,
      type: 'status_change' as const,
      title: 'Task Updated',
      message: `"${task?.title || original.title}": ${changes.join('; ')}`,
      task: task?._id || id,
      board: data.board || original.board,
    }));
    await Notification.insertMany(notifications);
  }

  return task;
};

const deleteTask = async (id: string) => {
  const task = await Task.findById(id);
  if (!task) return false;
  await Column.findByIdAndUpdate(task.column, { $pull: { tasks: id } });
  await Task.deleteOne({ _id: id });
  return true;
};

const addComment = async (id: string, content: string, userId: string) => {
  const comment = { content, author: userId, createdAt: new Date(), updatedAt: new Date() };
  const task = await Task.findByIdAndUpdate(
    id,
    { $push: { comments: comment } },
    { new: true }
  ).populate('comments.author', 'username email');
  if (!task) return null;

  const notifications = task.assignees
    .filter((a) => a.toString() !== userId)
    .map((assigneeId) => ({
      recipient: assigneeId,
      type: 'comment' as const,
      title: 'New Comment',
      message: `New comment on task "${task.title}": "${content.substring(0, 100)}"`,
      task: task._id,
      board: task.board,
    }));
  if (notifications.length > 0) await Notification.insertMany(notifications);
  return task;
};

const addAttachment = async (id: string, attachment: any, userId: string) => {
  const att = { ...attachment, uploadedBy: userId, uploadedAt: new Date() };
  const task = await Task.findByIdAndUpdate(
    id,
    { $push: { attachments: att } },
    { new: true }
  );
  return task;
};

const addTimeEntry = async (id: string, entry: any, userId: string) => {
  const timeEntry = { ...entry, user: userId, startedAt: new Date(entry.startedAt), endedAt: entry.endedAt ? new Date(entry.endedAt) : undefined };
  const task = await Task.findByIdAndUpdate(
    id,
    {
      $push: { timeTracking: timeEntry },
      $inc: { totalTimeSpent: entry.duration },
    },
    { new: true }
  );
  return task;
};

const reorderTask = async (id: string, columnId: string, order: number) => {
  const task = await Task.findByIdAndUpdate(id, { column: columnId, order }, { new: true });
  return task;
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  addAttachment,
  addTimeEntry,
  reorderTask,
};
