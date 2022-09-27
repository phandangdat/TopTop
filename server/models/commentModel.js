const mongoose = require('mongoose');
const filter = require('../util/filter');

const CommentSchema = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: 'Videos',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      max: 150,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'Comments',
    },
    children: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comments',
      },
    ],
  },
  {
    timestamps: true,
  }
);

CommentSchema.post('remove', async function (res, next) {
  const comments = await this.model('Comment').find({ parent: this._id });

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    await comment.remove();
  }

  next();
});

CommentSchema.pre('save', function (next) {
  if (this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
