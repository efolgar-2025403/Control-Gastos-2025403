import { Router } from 'express';

import { CategoryController } from '../controllers/category.controller.js';
import { authenticateToken } from '../../auth/middlewares/auth.middleware.js';

const router = Router();

const categoryController = new CategoryController();

router.use(authenticateToken);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;