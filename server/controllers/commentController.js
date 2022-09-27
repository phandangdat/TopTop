const Users = require('../models/userModel');
const Videos = require('../models/videoModel');
const Comments = require('../models/commentModel');
const cooldown = new Set();

const commentController = {
  createComment: async (req, res) => {
    try {
      const videoId = req.params.id;
      const { content, parentId } = req.body;
      const userId = req.user.id;

      const video = await Videos.findById(videoId);

      if (!video) {
        throw new Error('Không tìm thấy video');
      }

      if (cooldown.has(userId)) {
        throw new Error(
          'Bạn đang bình luận quá thường xuyên. Vui lòng thử lại trong thời gian ngắn.'
        );
      }

      cooldown.add(userId);
      setTimeout(() => {
        cooldown.delete(userId);
      }, 10000);

      const comment = await Comments.create({
        content,
        parent: parentId,
        video: videoId,
        commenter: userId,
      });

      video.comments_count += 1;

      await video.save();

      await Comments.populate(comment, {
        path: 'commenter',
        select: '-password -birthDay -role -__v -email',
      });

      return res.json(comment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
  getPostComments: async (req, res) => {
    try {
      const videoId = req.params.id;

      const comments = await Comments.find({ video: videoId })
        .populate('commenter', '-password')
        .sort('-createdAt');

      let commentParents = {};
      let rootComments = [];

      for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        commentParents[comment._id] = comment;
      }

      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (comment.parent) {
          let commentParent = commentParents[comment.parent];
          commentParent.children = [...commentParent.children, comment];
        } else {
          rootComments = [...rootComments, comment];
        }
      }
      return res.json(rootComments);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  },
};

module.exports = commentController;
