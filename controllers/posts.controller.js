const Post = require('../models/post.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError(`Post not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/v1/posts/:id
// @access  Private
exports.createPost = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PATCH /api/v1/posts/:id
// @access  Private
exports.updatePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError(`Post not found with id: ${req.params.id}`, 404));
  }

  if (!post.owner.toString() !== req.user.id) {
    return next(
      new AppError(
        `user ${req.params.id} is not authorized to update this post`,
        401
      )
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError(`Post not found with id: ${req.params.id}`, 404));
  }

  res.status(204).json({ success: true, data: null });
});
