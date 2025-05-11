import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import * as bookController from '../controllers/bookController';

const router = Router();

router.get('/', bookController.getAllBooks);
router.get('/', bookController.searchBooks);
router.post('/', authenticateToken, requireAdmin, bookController.createBook);
router.put('/:id', authenticateToken, requireAdmin, bookController.updateBook);
router.delete('/:id', authenticateToken, requireAdmin, bookController.deleteBook);

export default router; 