const router = require('express').Router();
const { getUsers, getUsersById } = require('../controllers/users');
const { profileRouter } = require('./profile');
const { validateUserId } = require('../middlewares/requestValidation');

router.use('/me', profileRouter);

router.get('/:id', validateUserId, getUsersById);

router.get('/', getUsers);

module.exports = {
  usersRouter: router,
};
