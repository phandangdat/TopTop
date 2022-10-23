const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.post('/register', userController.register);
router.post('/activation', userController.activateEmail);
router.post('/login', userController.login);
router.post('/refresh_token', userController.getAccessToken);
router.post('/forgot', userController.forgotPassword);
router.post('/resetPassword', auth, userController.resetPassword);
router.get('/infor', auth, userController.getUserInfor);
router.get('/all_infor', auth, userController.getUsersAllInfor);
router.get('/logout', userController.logout);
router.patch('/update', auth, userController.updateUser);
router.patch(
  '/update_role/:id',
  auth,
  authAdmin,
  userController.updateUsersRole
);
router.delete('/delete/:id', auth, authAdmin, userController.deleteUser);
router.get('/search_user', userController.searchUser);

// Social Login
router.post('/google_login', userController.googleLogin);
router.post('/facebook_login', userController.facebookLogin);

router.post('/follow/:id', auth, userController.follow);
router.delete('/unfollow/:id', auth, userController.unfollow);

router.get('/users_followed', auth, userController.usersFollowed);
router.get('/random_users', userController.getRandomUsers);
module.exports = router;
