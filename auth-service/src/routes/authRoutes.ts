import { Router } from 'express';
import { register, login, me } from '../controller/authcontroller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);

export default router;
