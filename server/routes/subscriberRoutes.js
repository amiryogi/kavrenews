import express from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
} from '../controllers/subscriberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', subscribe);
router.put('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', protect, authorize('admin'), getSubscribers);
router.delete('/:id', protect, authorize('admin'), deleteSubscriber);

export default router;
