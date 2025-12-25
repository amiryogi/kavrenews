import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      np: {
        type: String,
        required: [true, 'नेपाली नाम आवश्यक छ'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, 'विवरण ५०० अक्षरभन्दा बढी हुन सक्दैन'],
    },
    icon: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
