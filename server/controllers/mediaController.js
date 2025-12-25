import Media from '../models/Media.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Upload media
// @route   POST /api/media/upload
// @access  Private
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'कृपया फाइल अपलोड गर्नुहोस्',
      });
    }

    const { title, caption } = req.body;

    // Determine type based on mimetype
    const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename,
      type,
      title,
      caption,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'फाइल सफलतापूर्वक अपलोड भयो',
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media
// @route   GET /api/media
// @access  Private
export const getMedia = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const { type } = req.query;

    const query = {};
    if (type) query.type = type;

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: media.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'मिडिया फेला परेन',
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    await media.deleteOne();

    res.json({
      success: true,
      message: 'मिडिया सफलतापूर्वक मेटियो',
    });
  } catch (error) {
    next(error);
  }
};
