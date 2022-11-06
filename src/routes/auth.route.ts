import { Router } from 'express';
import AuthController from '../controllers/api/auth.controller';
import extractJWT from '../middleware/extractJWT';

const router = Router();

/** Set up your api routes here */

// Auth routes
router.post('/validate', extractJWT, AuthController.validateToken);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
