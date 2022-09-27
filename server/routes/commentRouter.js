const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

router.post('/comments/:id', auth, commentController.createComment);
router.get('/comments/video/:id', commentController.getPostComments);

module.exports = router;
