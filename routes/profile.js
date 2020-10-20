const router = require('express').Router();

const { editProfile, editAvatar } = require('../controllers/profile');
const { validateEditProfile, validateEditAvatar } = require('../middlewares/requestValidation');

router.patch('/', validateEditProfile, editProfile);

router.patch('/avatar', validateEditAvatar, editAvatar);

module.exports = {
  profileRouter: router,
};
