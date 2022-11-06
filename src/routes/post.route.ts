import { Router } from 'express';
import { ValidateSchema, Schemas } from '../middleware/ValidateSchema';
import PostController from '../controllers/api/post.controller';

const router = Router();

/** Set up your api routes here */

// Post routes
router.get('/', PostController.index);
router.post('/', ValidateSchema(Schemas.post.create), PostController.create);
router.patch('/:id', ValidateSchema(Schemas.post.update), PostController.update);
router.get('/:id', PostController.show);
router.delete('/:id', PostController.delete);

export default router;
