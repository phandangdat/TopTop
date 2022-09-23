const mongoose = require('mongoose');

const VideoLike = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Types.ObjectId,
      ref: 'Videos',
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    userIdVideo: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('videoLike', VideoLike);
