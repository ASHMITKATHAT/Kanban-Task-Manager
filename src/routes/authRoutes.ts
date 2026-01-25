import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middlewares/validation';
import { registerUserSchema, loginUserSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validateRequest(registerUserSchema), register);
router.post('/login', validateRequest(loginUserSchema), login);

export default router;

// update 2026-01-01 15:36:00

// update 2026-01-25 16:24:09
