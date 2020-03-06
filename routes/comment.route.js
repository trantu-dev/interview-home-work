const express = require('express');
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/comment.controller');
const Comment = require('../models/comment.model');
const { protect, authorize } = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getComments)
  .post(protect, authorize('user', 'admin'), addComment);

router
  .route('/:id')
  .get(getComment)
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
