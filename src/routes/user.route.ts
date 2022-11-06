import { Router } from 'express';
import { ValidateSchema, Schemas } from '../middleware/ValidateSchema';
import UserController from '../controllers/api/user.controller';
import extractJWT from '../middleware/extractJWT';

const router = Router();

/** Set up your api routes here */
// User routes
router.get('/', UserController.index);
router.post('/', ValidateSchema(Schemas.user.create), UserController.create);
router.patch('/:id', ValidateSchema(Schemas.user.update), UserController.update);
router.get('/:id', UserController.show);
router.delete('/:id', UserController.delete);
router.post('/me', extractJWT, UserController.me);

export default router;
