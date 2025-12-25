import express from 'express';
import {
  getCommentsByNews,
  createComment,
  getAllComments,
  approveComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/news/:newsId', getCommentsByNews);
router.post('/', createComment);

// Protected routes (Admin/Editor)
router.get('/admin', protect, authorize('admin', 'editor'), getAllComments);
router.put('/:id/approve', protect, authorize('admin', 'editor'), approveComment);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteComment);

export default router;
