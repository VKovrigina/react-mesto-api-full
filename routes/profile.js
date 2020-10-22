const router = require('express').Router();

const { editProfile, editAvatar, getProfile } = require('../controllers/profile');
const { validateEditProfile, validateEditAvatar } = require('../middlewares/requestValidation');

router.get('/', getProfile);

router.patch('/', validateEditProfile, editProfile);

router.patch('/avatar', validateEditAvatar, editAvatar);

module.exports = {
  profileRouter: router,
};
