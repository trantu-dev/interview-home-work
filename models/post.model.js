const mongoose = require('mongoose');
const slug = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title must be required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'Content must be required'],
      trim: true
    },
    tags: {
      type: [String],
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PostSchema.pre('save', function(next) {
  this.slug = slug(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Post', PostSchema);
