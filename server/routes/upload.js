const router = require('express').Router();
const uploadImage = require('../middleware/uploadImage');
const uploadAvatarController = require('../controllers/uploadAvatarController');
const auth = require('../middleware/auth');

router.post(
  '/upload_avatar',
  uploadImage,
  auth,
  uploadAvatarController.uploadAvatar
);

module.exports = router;
