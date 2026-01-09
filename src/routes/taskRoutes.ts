import { Router } from 'express';
import {
  getAllTasks, getTaskById, createTask, updateTask, deleteTask,
  addComment, addAttachment, addTimeEntry, reorderTask,
} from '../controllers/taskController';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import {
  createTaskSchema, updateTaskSchema, addCommentSchema, addAttachmentSchema,
  timeEntrySchema, taskFilterSchema, taskIdSchema,
} from '../validators/taskValidator';

const router = Router();

router.get('/', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskFilterSchema, 'query'), getAllTasks);
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), getTaskById);
router.post('/', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(createTaskSchema), createTask);
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), validateRequest(taskIdSchema, 'params'), deleteTask);
router.post('/:id/comments', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), validateRequest(addCommentSchema), addComment);
router.post('/:id/attachments', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), validateRequest(addAttachmentSchema), addAttachment);
router.post('/:id/time', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), validateRequest(timeEntrySchema), addTimeEntry);
router.put('/:id/reorder', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(taskIdSchema, 'params'), reorderTask);

export default router;
