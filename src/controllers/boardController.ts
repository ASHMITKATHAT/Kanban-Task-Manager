import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { createBoardSchema, updateBoardSchema, getBoardSchema } from '../validators/boardValidator';
import * as BoardService from "../services/boardService";

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBoardSchema.parse(req.body);
    const board = await BoardService.createBoard(validatedData);
    logger.info(`Board created with ID: ${board._id}`);
    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boards = await BoardService.getAllBoards();
    res.status(200).json(boards);
  } catch (error) {
    next(error);
  }
};

export const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.id;
    const validatedParams = getBoardSchema.parse({ id: boardId });
    const board = await BoardService.getBoardById(validatedParams.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.id;
    const validatedParams = getBoardSchema.parse({ id: boardId });
    const validatedData = updateBoardSchema.parse(req.body);
    const board = await BoardService.updateBoard(validatedParams.id, validatedData);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    logger.info(`Board updated with ID: ${board._id}`);
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = req.params.id;
    const validatedParams = getBoardSchema.parse({ id: boardId });
    const result = await BoardService.deleteBoard(validatedParams.id);
    if (!result) {
      return res.status(404).json({ message: 'Board not found' });
    }
    logger.info(`Board deleted with ID: ${boardId}`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
