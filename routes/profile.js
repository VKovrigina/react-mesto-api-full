const router = require('express').Router();

const { editProfile, editAvatar } = require('../controllers/profile');

router.patch('/', editProfile);

router.patch('/avatar', editAvatar);

module.exports = {
  profileRouter: router,
};
