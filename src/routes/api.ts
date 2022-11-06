import { Router } from 'express';
import UserController from '../controllers/api/user.controller';
import IndexController from '../controllers/api/index.controller';

import authRoutes from './auth.route';
import userRoutes from './user.route';
import postRoutes from './post.route';

const router = Router();

/** Set up your api routes here */

// Health check
router.get('/', IndexController.index);
router.get('/ping', IndexController.health);

// Auth routes
router.use('/auth', authRoutes);
// User routes
router.use('/users', userRoutes);
// Post routes
router.use('/posts', postRoutes);

export default router;
