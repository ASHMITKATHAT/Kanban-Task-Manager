import { Router } from 'express';
import {
  createBoard, getBoards, getBoardById, updateBoard, deleteBoard,
  addColumn, updateColumn, deleteColumn, addMember, removeMember,
} from '../controllers/boardController';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { createBoardSchema, updateBoardSchema } from '../validators/boardValidator';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validateRequest(createBoardSchema), createBoard);
router.get('/', authenticateToken, authorizeRoles('Admin', 'User'), getBoards);
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'User'), getBoardById);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), validateRequest(updateBoardSchema), updateBoard);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteBoard);

router.post('/:id/columns', authenticateToken, authorizeRoles('Admin', 'User'), addColumn);
router.put('/:id/columns/:columnId', authenticateToken, authorizeRoles('Admin', 'User'), updateColumn);
router.delete('/:id/columns/:columnId', authenticateToken, authorizeRoles('Admin'), deleteColumn);

router.post('/:id/members', authenticateToken, authorizeRoles('Admin'), addMember);
router.delete('/:id/members/:memberId', authenticateToken, authorizeRoles('Admin'), removeMember);

export default router;

// update 2026-01-29 11:58:34
