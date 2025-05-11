import { Router } from 'express';
import bookRoutes from './bookRoutes';
import authorRoutes from './authorRoutes';
import publisherRoutes from './publisherRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/publishers', publisherRoutes);
router.use('/user', userRoutes);

export default router; 