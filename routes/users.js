const router = require('express').Router();
const { getUsers, getUsersById } = require('../controllers/users');
const { profileRouter } = require('./profile');

router.use('/me', profileRouter);

router.get('/:id', getUsersById);

router.get('/', getUsers);

module.exports = {
  usersRouter: router,
};
