import Comment from '../models/Comment.js';

// @desc    Get comments for a news article
// @route   GET /api/comments/news/:newsId
// @access  Public
export const getCommentsByNews = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      news: req.params.newsId,
      isApproved: true,
      parent: null,
    })
      .populate({
        path: 'parent',
        match: { isApproved: true },
      })
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parent: comment._id,
          isApproved: true,
        }).sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json({
      success: true,
      count: commentsWithReplies.length,
      data: commentsWithReplies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Public
export const createComment = async (req, res, next) => {
  try {
    const { news, name, email, content, parent } = req.body;

    const comment = await Comment.create({
      news,
      name,
      email,
      content,
      parent,
      isApproved: false, // Comments need approval
    });

    res.status(201).json({
      success: true,
      message: 'तपाईंको टिप्पणी प्राप्त भयो। स्वीकृतिपछि देखिनेछ।',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments (admin)
// @route   GET /api/comments/admin
// @access  Private (Admin/Editor)
export const getAllComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const { isApproved } = req.query;

    const query = {};
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate('news', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: comments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve comment
// @route   PUT /api/comments/:id/approve
// @access  Private (Admin/Editor)
export const approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'टिप्पणी फेला परेन',
      });
    }

    res.json({
      success: true,
      message: 'टिप्पणी स्वीकृत भयो',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Admin/Editor)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'टिप्पणी फेला परेन',
      });
    }

    // Delete all replies
    await Comment.deleteMany({ parent: comment._id });

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'टिप्पणी मेटियो',
    });
  } catch (error) {
    next(error);
  }
};
