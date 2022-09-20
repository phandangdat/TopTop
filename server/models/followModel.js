const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    followingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('follow', FollowSchema);
