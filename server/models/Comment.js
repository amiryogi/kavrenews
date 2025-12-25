import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'नाम आवश्यक छ'],
      trim: true,
      maxlength: [50, 'नाम ५० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    email: {
      type: String,
      required: [true, 'इमेल आवश्यक छ'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'कृपया मान्य इमेल प्रविष्ट गर्नुहोस्',
      ],
    },
    content: {
      type: String,
      required: [true, 'टिप्पणी लेख्नुहोस्'],
      maxlength: [1000, 'टिप्पणी १००० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ news: 1, isApproved: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
