import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import * as BoardService from '../services/boardService';

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await BoardService.default.createBoard({ ...req.body, owner: req.user!.userId });
    logger.info(`Board created with ID: ${board._id}`);
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boards = await BoardService.default.getAllBoards();
    res.status(200).json(boards);
  } catch (error) {
    next(error);
  }
};

export const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await BoardService.default.getBoardById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await BoardService.default.updateBoard(req.params.id, req.body);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    logger.info(`Board updated with ID: ${board._id}`);
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BoardService.default.deleteBoard(req.params.id);
    if (!result) return res.status(404).json({ message: 'Board not found' });
    logger.info(`Board deleted with ID: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const column = await BoardService.default.addColumn({ ...req.body, board: req.params.id });
    res.status(201).json(column);
  } catch (error) {
    next(error);
  }
};

export const updateColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const column = await BoardService.default.updateColumn(req.params.columnId, req.body);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.status(200).json(column);
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BoardService.default.deleteColumn(req.params.columnId);
    if (!result) return res.status(404).json({ message: 'Column not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await BoardService.default.addMember(req.params.id, req.body.userId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await BoardService.default.removeMember(req.params.id, req.params.memberId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};
