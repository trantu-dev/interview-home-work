const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../controllers/auth.controller');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');
const commentRouter = require('./comment.route');

router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(getPosts)
  .post(protect, authorize('admin', 'user'), createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(protect, authorize('admin', 'user'), updatePost)
  .delete(protect, authorize('admin', 'user'), deletePost);

module.exports = router;
