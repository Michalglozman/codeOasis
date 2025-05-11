import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import * as authorController from '../controllers/authorController';

const router = Router();

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);
router.post('/', authenticateToken, requireAdmin, authorController.createAuthor);
router.put('/:id', authenticateToken, requireAdmin, authorController.updateAuthor);
router.delete('/:id', authenticateToken, requireAdmin, authorController.deleteAuthor);

export default router; 