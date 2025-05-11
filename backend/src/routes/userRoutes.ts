import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

router.post('/auth/login', userController.userLogin);
router.post('/auth/admin/login', userController.adminLogin);
router.post('/books/purchase', authenticateToken, userController.purchaseBook);
router.get('/books/purchased', authenticateToken, userController.getPurchasedBooks);

export default router;