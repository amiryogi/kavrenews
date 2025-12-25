import News from '../models/News.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all news (public, paginated)
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    res.json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news by slug
// @route   GET /api/news/:slug
// @access  Public
export const getNewsBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug, status: 'published' })
      .populate('category', 'name slug')
      .populate('author', 'name avatar');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'समाचार फेला परेन',
      });
    }

    // Increment view count
    news.viewCount += 1;
    await news.save();

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:slug
// @access  Public
export const getNewsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // First find the category by slug
    const Category = (await import('../models/Category.js')).default;
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'वर्ग फेला परेन',
      });
    }

    const query = { category: category._id, status: 'published' };
    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    res.json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      category: category,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
export const getFeaturedNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const news = await News.find({ isFeatured: true, status: 'published' })
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('-content');

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get breaking news
// @route   GET /api/news/breaking
// @access  Public
export const getBreakingNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const news = await News.find({ isBreaking: true, status: 'published' })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug publishedAt');

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search news
// @route   GET /api/news/search
// @access  Public
export const searchNews = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'कृपया खोज्ने शब्द प्रविष्ट गर्नुहोस्',
      });
    }

    const query = {
      status: 'published',
      $text: { $search: q },
    };

    const total = await News.countDocuments(query);
    const news = await News.find(query, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .select('-content');

    res.json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      query: q,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related news
// @route   GET /api/news/:id/related
// @access  Public
export const getRelatedNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;

    const currentNews = await News.findById(req.params.id);
    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: 'समाचार फेला परेन',
      });
    }

    // Find related news by category and tags
    const news = await News.find({
      _id: { $ne: currentNews._id },
      status: 'published',
      $or: [
        { category: currentNews.category },
        { tags: { $in: currentNews.tags } },
      ],
    })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug excerpt featuredImage publishedAt');

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending news (most viewed)
// @route   GET /api/news/trending
// @access  Public
export const getTrendingNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const news = await News.find({ status: 'published' })
      .populate('category', 'name slug')
      .sort({ viewCount: -1 })
      .limit(limit)
      .select('title slug excerpt featuredImage viewCount publishedAt');

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private
export const createNews = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      message: 'समाचार सफलतापूर्वक सिर्जना भयो',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private
export const updateNews = async (req, res, next) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'समाचार फेला परेन',
      });
    }

    // Check ownership (except admin)
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'तपाईंलाई यो समाचार सम्पादन गर्न अनुमति छैन',
      });
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'समाचार सफलतापूर्वक अपडेट भयो',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private
export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'समाचार फेला परेन',
      });
    }

    // Check ownership (except admin)
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'तपाईंलाई यो समाचार मेटाउन अनुमति छैन',
      });
    }

    // Delete featured image from Cloudinary
    if (news.featuredImage && news.featuredImage.publicId) {
      await cloudinary.uploader.destroy(news.featuredImage.publicId);
    }

    // Delete gallery images from Cloudinary
    if (news.gallery && news.gallery.length > 0) {
      for (const image of news.gallery) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await news.deleteOne();

    res.json({
      success: true,
      message: 'समाचार सफलतापूर्वक मेटियो',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all news (admin - includes drafts)
// @route   GET /api/news/admin/all
// @access  Private
export const getAllNewsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { status, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    // Non-admin users can only see their own news
    if (req.user.role !== 'admin') {
      query.author = req.user.id;
    }

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};
