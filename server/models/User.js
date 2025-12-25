import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'कृपया नाम प्रविष्ट गर्नुहोस्'],
      trim: true,
      maxlength: [50, 'नाम ५० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    email: {
      type: String,
      required: [true, 'कृपया इमेल प्रविष्ट गर्नुहोस्'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'कृपया मान्य इमेल प्रविष्ट गर्नुहोस्',
      ],
    },
    password: {
      type: String,
      required: [true, 'कृपया पासवर्ड प्रविष्ट गर्नुहोस्'],
      minlength: [6, 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'reporter'],
      default: 'reporter',
    },
    avatar: {
      url: String,
      publicId: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
