const Users = require('../models/userModel');
const Follows = require('../models/followModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');

const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fetch = require('node-fetch');

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const userController = {
  register: async (req, res) => {
    try {
      const { monthOfBirth, dateOfBirth, yearOfBirth, email, password } =
        req.body;

      if (!monthOfBirth || !dateOfBirth || !yearOfBirth || !email || !password)
        return res.status(400).json({ message: 'Hãy nhập đủ các thông tin' });

      if (!validateEmail(email))
        return res.status(400).json({ message: 'Email không hợp lệ' });

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ message: 'Email này đã được đăng ký' });

      if (password.length < 8)
        return res
          .status(400)
          .json({ message: 'Mật khẩu cần ít nhất 8 kí tự' });

      if (password.length > 20)
        return res.status(400).json({ message: 'Mật khẩu tối đa là 20 kí tự' });

      const birthDay = `${dateOfBirth}/${monthOfBirth}/${yearOfBirth}`;
      const nickname = `user${Math.ceil(Math.random() * 10000000000)}`;
      const name = nickname;

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = {
        email,
        password: passwordHash,
        name,
        nickname,
        birthDay,
      };

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendMail.sendEmailActive(email, url, 'Verify your email address');

      res.json({
        stauts: 200,
        message:
          'Đăng ký thành công! Vui lòng kiểm tra email của bạn để kích hoạt tài khoản',
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { birthDay, email, password, nickname, name } = user;

      const check = await Users.findOne({ email });
      if (check)
        return res.status(400).json({
          message: 'Email này đã được đăng ký trước đó. Vui lòng kiểm tra lại',
        });

      const newUser = new Users({
        email,
        password,
        name,
        nickname,
        birthDay,
      });

      await newUser.save();

      res.status(200).json({
        message:
          'Tài khoản đã được kích hoạt thành công! Hãy đăng nhập để trải nghiệm',
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });

      res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie');
      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ message: 'Hãy đăng nhập' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ message: 'Hãy đăng nhập' });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Email này không tồn tại' });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail.sendEmailForgot(email, url, 'Reset your password');
      res.json({ message: 'Đã gửi yêu cầu. Vui lòng kiểm tra email của bạn' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ message: 'Thay đổi mật khẩu thành công' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select(
        '-password -birthDay -createdAt -updatedAt -role -__v'
      );

      res.json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getUsersAllInfor: async (req, res) => {
    try {
      const users = await Users.find().select('-password');

      res.json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        }
      );

      res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res.json({ message: 'Update Success!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);

      res.json({ message: 'Deleted Success!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });
      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;

      const passwordHash = await bcrypt.hash(password, 12);

      if (!email_verified)
        return res
          .status(400)
          .json({ message: 'Xác minh email không thành công' });

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: 'Mật khẩu không chính xác' });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Đăng nhập thành công' });
      } else {
        const { tokenId } = req.body;
        const nickname = `user${tokenId.slice(0, 10)}`;
        const newUser = new Users({
          nickname,
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Đăng nhập thành công' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: 'Password is incorrect.' });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Đăng nhập thành công' });
      } else {
        const { userID } = req.body;
        const nickname = `user${userID.slice(0, 10)}`;
        const newUser = new Users({
          nickname,
          name,
          email,
          password: passwordHash,
          avatar: picture.data.url,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Đăng nhập thành công' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const userId = req.user.id;
      const followingId = req.params.id;

      const existingFollow = await Follows.findOne({ userId, followingId });

      if (existingFollow) {
        throw new Error('Already following this user');
      }
      const follow = await Follows.create({ userId, followingId });

      const userIsFollowed = await Users.findById(followingId);
      userIsFollowed.followers_count = (
        await Follows.find({ followingId })
      ).length;
      await userIsFollowed.save();

      const userFollow = await Users.findById(userId);
      userFollow.followings_count = (await Follows.find({ userId })).length;
      await userFollow.save();

      return res.status(200).json({ data: follow });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const userId = req.user.id;
      const followingId = req.params.id;

      const existingFollow = await Follows.findOne({ userId, followingId });
      if (!existingFollow) {
        throw new Error('Not already following user');
      }

      await existingFollow.remove();

      const userIsFollowed = await Users.findById(followingId);
      userIsFollowed.followers_count = (
        await Follows.find({ followingId })
      ).length;
      await userIsFollowed.save();

      const userFollow = await Users.findById(userId);
      userFollow.followings_count = (await Follows.find({ userId })).length;
      await userFollow.save();

      return res.status(200).json({ data: existingFollow });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
  usersFollowed: async (req, res) => {
    try {
      let { page, size } = req.query;
      const limit = parseInt(size) || 10;
      const skip = parseInt(page) || 0;
      const userId = req.user.id;
      const usersFollowed = await Follows.find({ userId });
      const usersFollowedId = usersFollowed.map((userFollowed) => {
        return userFollowed.followingId;
      });
      const users = await Users.find({ _id: usersFollowedId })
        .sort({ createdAt: -1 })
        .select('-password -birthDay -createdAt -updatedAt -role -__v')
        .limit(limit)
        .skip(skip * limit);
      await setFollowed(users, userId);
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getRandomUsers: async (req, res) => {
    try {
      let { page, per_page } = req.query;
      let size = parseInt(per_page) || 10;
      const skip = parseInt(page) || 0;

      const users = await Users.find().select(
        '-password -birthDay -createdAt -updatedAt -role -__v'
      );

      const randomUsers = [];

      if (size > users.length) {
        size = users.length;
      }

      if (skip === 1) {
        size = size + 5;
      }
      const randomIndices = getRandomIndices(size, users.length);

      for (let i = 0; i < randomIndices.length; i++) {
        const randomUser = users[randomIndices[i]];
        randomUsers.push(randomUser);
      }

      return res.status(200).json(randomUsers);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
  },
  searchUser: async (req, res) => {
    const searchValue = req.query.user;
    const user = await Users.find({
      $or: [
        {
          name: { $regex: searchValue },
        },
        {
          nickname: { $regex: searchValue },
        },
      ],
    });
    res.json(user);
  },
};

function getRandomIndices(size, sourceSize) {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
}
const setFollowed = async (users, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const usersFollowed = await Follows.find(searchCondition);
  users.forEach((user) => {
    usersFollowed.forEach((userFollowed) => {
      if (userFollowed.followingId.equals(user._id)) {
        user.is_followed = true;
        return;
      }
    });
  });
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '5m',
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = userController;
