import express from 'express';
import {
  getNews,
  getNewsBySlug,
  getNewsByCategory,
  getFeaturedNews,
  getBreakingNews,
  searchNews,
  getRelatedNews,
  getTrendingNews,
  createNews,
  updateNews,
  deleteNews,
  getAllNewsAdmin,
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getNews);
router.get('/featured', getFeaturedNews);
router.get('/breaking', getBreakingNews);
router.get('/trending', getTrendingNews);
router.get('/search', searchNews);
router.get('/category/:slug', getNewsByCategory);
router.get('/:slug', getNewsBySlug);
router.get('/:id/related', getRelatedNews);

// Protected routes
router.get('/admin/all', protect, getAllNewsAdmin);
router.post('/', protect, authorize('admin', 'editor', 'reporter'), createNews);
router.put('/:id', protect, authorize('admin', 'editor', 'reporter'), updateNews);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteNews);

export default router;
