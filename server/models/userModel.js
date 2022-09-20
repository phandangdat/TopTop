const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter your email!'],
      trim: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password!'],
      min: 8,
      max: 20,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/brhtheorist/image/upload/v1661747703/avatar/default-avatar_f1prym.png',
    },
    followings_count: { type: Number, default: 0 },
    followers_count: { type: Number, default: 0 },
    likes_count: { type: Number, default: 0 },
    tick: { type: Boolean, default: false },
    role: { type: Number, default: 0 }, // 0 = user, 1 = admin
    name: { type: String, trim: true, required: true, max: 50 },
    nickname: { type: String, trim: true, unique: true, max: 20 },
    birthDay: { type: String },
    bio: { type: String },
    is_followed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Users', userSchema);
