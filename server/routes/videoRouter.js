const router = require('express').Router();
const uploadVideo = require('../middleware/uploadVideo');
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

router.post('/upload_video', uploadVideo, auth, videoController.uploadVideo);
router.get('/videos', videoController.getVideos);
router.get('/videos_orther_user', auth, videoController.getVideoOrtherUser);
router.post('/like/:id', auth, videoController.likeVideo);
router.delete('/like/:id', auth, videoController.unlikeVideo);

module.exports = router;
