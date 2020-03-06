const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all comments
// @route   GET /api/v1/comments
// @route   GET /api/v1/posts/:postId/comments
// @access  Public
exports.getComments = catchAsync(async (req, res, next) => {
  console.log('hello comments');
  let comments;
  if (req.params.postId) {
    comments = await Comment.find({ post: req.params.postId });
  } else {
    console.log('hello comments 1');
    comments = await Comment.find();
  }

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Get single comment
// @route   GET /api/v1/comments/:id
// @access  Public
exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id)
    .populate({
      path: 'post',
      select: 'title'
    })
    .populate({
      path: 'owner',
      select: 'name'
    });

  if (!comment) {
    return next(
      new AppError(`no comment found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Add comment
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
exports.addComment = catchAsync(async (req, res, next) => {
  req.body.post = req.params.postId;
  req.body.owner = req.user.id;
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError(`no post with id: ${req.params.postId}`, 404));
  }
  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PATCH /api/v1/comments/:id
// @access  Private
exports.updateComment = catchAsync(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError(`no comment with id: ${req.params.id}`, 404));
  }

  if (comment.owner.toString() !== req.user.id) {
    return next(
      new AppError(`this comment not belongs to id: ${req.user.id}`, 401)
    );
  }
  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = catchAsync(async (req, res, next) => {
  console.log('hello');
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError(`no comment with id: ${req.params.id}`, 404));
  }

  if (comment.owner.toString() !== req.user.id) {
    return next(
      new AppError(`this comment not belongs to id: ${req.user.id}`, 401)
    );
  }
  await comment.remove();

  res.status(204).json({
    success: true,
    data: null
  });
});
