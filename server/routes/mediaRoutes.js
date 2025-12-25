import express from 'express';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.post('/upload', protect, upload.single('file'), uploadMedia);
router.get('/', protect, getMedia);
router.delete('/:id', protect, deleteMedia);

export default router;
