import { Router } from 'express';
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from '../controllers/boardController';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { createBoardSchema, updateBoardSchema, getBoardSchema } from '../validators/boardValidator';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validateRequest(createBoardSchema), createBoard);
router.get('/', authenticateToken, authorizeRoles('Admin', 'User'), getBoards);
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(getBoardSchema, 'params'), getBoardById);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), validateRequest(getBoardSchema, 'params'), validateRequest(updateBoardSchema), updateBoard);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), validateRequest(getBoardSchema, 'params'), deleteBoard);

export default router;
