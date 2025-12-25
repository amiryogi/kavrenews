import mongoose from 'mongoose';
import slugify from 'slugify';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'समाचारको शीर्षक आवश्यक छ'],
      trim: true,
      maxlength: [200, 'शीर्षक २०० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    slug: {
      type: String,
      unique: true,
    },
    excerpt: {
      type: String,
      required: [true, 'समाचारको सारांश आवश्यक छ'],
      maxlength: [500, 'सारांश ५०० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    content: {
      type: String,
      required: [true, 'समाचारको विवरण आवश्यक छ'],
    },
    featuredImage: {
      url: {
        type: String,
        required: [true, 'मुख्य तस्विर आवश्यक छ'],
      },
      publicId: String,
      caption: String,
    },
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'वर्ग छनौट गर्नुहोस्'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBreaking: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, 'Meta title ७० अक्षरभन्दा बढी हुन सक्दैन'],
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description १६० अक्षरभन्दा बढी हुन सक्दैन'],
      },
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
newsSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    // Create a timestamp-based unique suffix
    const timestamp = Date.now().toString(36);
    // Use slugify for the title part, then append timestamp
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: 'vi', // Works well with non-latin characters
    });
    this.slug = `${baseSlug}-${timestamp}`;
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Index for search
newsSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Index for queries
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ isFeatured: 1, status: 1 });
newsSchema.index({ isBreaking: 1, status: 1 });

const News = mongoose.model('News', newsSchema);

export default News;
