const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    file_url: { type: String, required: true },
    caption: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    allows: { type: [], default: undefined },
    viewable: { type: String, trim: true },
    is_liked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Videos', videoSchema);
