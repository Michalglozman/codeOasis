import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import * as publisherController from '../controllers/publisherController';

const router = Router();

router.get('/', publisherController.getAllPublishers);
router.get('/:id', publisherController.getPublisherById);
router.post('/', authenticateToken, requireAdmin, publisherController.createPublisher);
router.put('/:id', authenticateToken, requireAdmin, publisherController.updatePublisher);
router.delete('/:id', authenticateToken, requireAdmin, publisherController.deletePublisher);

export default router; 