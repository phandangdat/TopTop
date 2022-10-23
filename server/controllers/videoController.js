const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Videos = require('../models/videoModel');
const videoLike = require('../models/videoLikeModel');
const Users = require('../models/userModel');
const Follows = require('../models/followModel');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const videoController = {
  uploadVideo: async (req, res) => {
    const file = req.files.file;
    cloudinary.uploader.upload(
      file.tempFilePath,
      {
        resource_type: 'video',
        folder: 'videos',
      },

      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err.message });
        }
        removeTmp(file.tempFilePath);
        const upload = new Videos({
          file_url: result.url,
          caption: req.body.caption,
          viewable: req.body.viewable,
          user: req.user.id,
        });
        await upload.save((err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
          }
          return res
            .status(200)
            .json({ message: 'Video của bạn đã được tải lên TopTop' });
        });
      }
    );
  },
  getVideos: async (req, res) => {
    try {
      let { page, size } = req.query;
      const limit = parseInt(size) || 10;
      const skip = parseInt(page) || 0;
      const videos = await Videos.find({})
        .sort({ createdAt: -1 })
        .populate('user', [
          'avatar',
          'name',
          'nickname',
          'likes_count',
          'followers_count',
          'tick',
          'bio',
        ])
        .limit(limit)
        .skip(skip * limit);
      res.status(200).json(videos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getVideoOrtherUser: async (req, res) => {
    try {
      let { page, per_page } = req.query;
      const limit = parseInt(per_page) || 10;
      const skip = parseInt(page) || 0;
      const userId = req.user.id;
      const videos = await Videos.find({ user: { $ne: userId } })
        .sort({ createdAt: -1 })
        .populate('user', [
          'avatar',
          'name',
          'nickname',
          'likes_count',
          'followers_count',
          'tick',
          'bio',
          'is_followed',
        ])
        .limit(limit)
        .skip(skip * limit);
      await setLiked(videos, userId);
      await setFollowed(videos, userId);

      res.status(200).json(videos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getVideoFollowUser: async (req, res) => {
    try {
      let { page, per_page } = req.query;
      const limit = parseInt(per_page) || 10;
      const skip = parseInt(page) || 0;
      const userId = req.user.id;
      const userFollowing = await Follows.find({ userId });
      const userFollowed = userFollowing.map((user) => user.followingId);
      const videos = await Videos.find({ user: userFollowed })
        .sort({ createdAt: -1 })
        .populate('user', [
          'avatar',
          'name',
          'nickname',
          'likes_count',
          'followers_count',
          'tick',
          'bio',
          'is_followed',
        ])
        .limit(limit)
        .skip(skip * limit);
      await setLiked(videos, userId);
      await setFollowed(videos, userId);
      res.status(200).json(videos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  likeVideo: async (req, res) => {
    try {
      const videoId = req.params.id;
      const userId = req.user.id;
      const userIdVideo = req.body.userIdVideo;

      const video = await Videos.findById(videoId);

      if (!video) {
        throw new Error('Video does not exist');
      }

      const existingVideoLike = await videoLike.findOne({ videoId, userId });

      if (existingVideoLike) {
        throw new Error('Post is already liked');
      }

      await videoLike.create({
        videoId,
        userId,
        userIdVideo,
      });

      video.likes_count = (await videoLike.find({ videoId })).length;
      await video.save();

      const user = await Users.findById(userIdVideo);
      user.likes_count = (await videoLike.find({ userIdVideo })).length;
      await user.save();

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
  unlikeVideo: async (req, res) => {
    try {
      const videoId = req.params.id;
      const userId = req.user.id;
      const userIdVideo = req.body.userIdVideo;
      const video = await Videos.findById(videoId);

      if (!video) {
        throw new Error('Video does not exist');
      }

      const existingVideoLike = await videoLike.findOne({
        videoId,
        userId,
        userIdVideo,
      });

      if (!existingVideoLike) {
        throw new Error('Video is already not liked');
      }

      await existingVideoLike.remove();

      video.likes_count = (await videoLike.find({ videoId })).length;
      await video.save();

      const user = await Users.findById(userIdVideo);
      user.likes_count = (await videoLike.find({ userIdVideo })).length;
      await user.save();

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};
const setLiked = async (videos, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userVideoLikes = await videoLike.find(searchCondition);

  videos.forEach((video) => {
    userVideoLikes.forEach((userVideoLike) => {
      if (userVideoLike.videoId.equals(video._id)) {
        video.is_liked = true;
        return;
      }
    });
  });
};
const setFollowed = async (videos, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const usersFollowed = await Follows.find(searchCondition);
  videos.forEach((video) => {
    usersFollowed.forEach((userFollowed) => {
      if (userFollowed.followingId.equals(video.user._id)) {
        video.user.is_followed = true;
        return;
      }
    });
  });
};
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = videoController;
