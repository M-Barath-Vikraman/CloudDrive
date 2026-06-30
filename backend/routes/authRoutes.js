import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public Authentication Endpoints
router.post('/signup', signup);
router.post('/login', login);

// Private Profile Endpoint (Guarded with authMiddleware)
router.get('/profile', authMiddleware, getProfile);

export default router;
export { router as authRoutes };
