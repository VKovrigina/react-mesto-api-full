const router = require('express').Router();
const { getUsers, getUsersById, postUser } = require('../controllers/users');
const { profileRouter } = require('./profile');

router.post('/', postUser);

router.use('/me', profileRouter);

router.get('/:id', getUsersById);

router.get('/', getUsers);

module.exports = {
  usersRouter: router,
};
