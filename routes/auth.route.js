const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  protect,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:resettoken', resetPassword);
router.patch('/updatepassword', protect, updatePassword);

module.exports = router;
