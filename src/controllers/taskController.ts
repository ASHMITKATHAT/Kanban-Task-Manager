import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import * as TaskService from '../services/taskService';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TaskService.default.getAllTasks(req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.createTask(req.body, req.user!.userId);
    logger.info(`Task created: ${task._id}`);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.updateTask(req.params.id, req.body, req.user!.userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    logger.info(`Task updated: ${task._id}`);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await TaskService.default.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    logger.info(`Task deleted: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.addComment(req.params.id, req.body.content, req.user!.userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const addAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.addAttachment(req.params.id, req.body, req.user!.userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const addTimeEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.default.addTimeEntry(req.params.id, req.body, req.user!.userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const reorderTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { columnId, order } = req.body;
    const task = await TaskService.default.reorderTask(req.params.id, columnId, order);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
