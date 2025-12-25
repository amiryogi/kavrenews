import User from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'प्रयोगकर्ता फेला परेन',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'यो इमेल पहिले नै दर्ता भइसकेको छ',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'प्रयोगकर्ता सफलतापूर्वक सिर्जना भयो',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'प्रयोगकर्ता फेला परेन',
      });
    }

    res.json({
      success: true,
      message: 'प्रयोगकर्ता अपडेट भयो',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'प्रयोगकर्ता फेला परेन',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'तपाईं आफूलाई मेटाउन सक्नुहुन्न',
      });
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatar && user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'प्रयोगकर्ता मेटियो',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Private (Admin)
export const resetUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'प्रयोगकर्ता फेला परेन',
      });
    }

    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'पासवर्ड रिसेट भयो',
    });
  } catch (error) {
    next(error);
  }
};
