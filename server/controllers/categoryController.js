import Category from '../models/Category.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true, parent: null })
      .populate('subcategories')
      .sort({ order: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('subcategories');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'वर्ग फेला परेन',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, order, parent } = req.body;

    // Generate slug from English name
    const slug = slugify(name.en, { lower: true, strict: true });

    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'यो वर्ग पहिले नै अवस्थित छ',
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      order,
      parent,
    });

    res.status(201).json({
      success: true,
      message: 'वर्ग सफलतापूर्वक सिर्जना भयो',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, order, isActive, parent } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'वर्ग फेला परेन',
      });
    }

    // Update slug if English name changed
    let slug = category.slug;
    if (name && name.en && name.en !== category.name.en) {
      slug = slugify(name.en, { lower: true, strict: true });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, icon, order, isActive, parent },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'वर्ग सफलतापूर्वक अपडेट भयो',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'वर्ग फेला परेन',
      });
    }

    // Check if category has news
    const News = (await import('../models/News.js')).default;
    const newsCount = await News.countDocuments({ category: category._id });

    if (newsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `यो वर्गमा ${newsCount} समाचार छन्। पहिले समाचारहरू सार्नुहोस्।`,
      });
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parent: category._id });
    if (subcategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'यो वर्गमा उप-वर्गहरू छन्। पहिले उप-वर्गहरू मेटाउनुहोस्।',
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'वर्ग सफलतापूर्वक मेटियो',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories (admin - includes inactive)
// @route   GET /api/categories/admin/all
// @access  Private (Admin)
export const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('subcategories')
      .sort({ order: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
