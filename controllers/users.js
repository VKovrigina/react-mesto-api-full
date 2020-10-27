const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

module.exports.createUser = (req, res, next) => {
  const {
    name: userName = 'Ваше имя',
    about: userAbout = 'О себе',
    avatar: userAvatar = 'https://images.unsplash.com/photo-1601844569046-b72c31389677?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=676&q=80',
    email: userEmail,
    password: userPassword,
  } = req.body;
  bcrypt.hash(userPassword, 10)
    .then((hash) => User.create({
      name: userName,
      about: userAbout,
      avatar: userAvatar,
      email: userEmail,
      password: hash,
    }))
    .then((user) => res
      .status(200)
      .send({ message: `Пользователь с именем '${user.name}' успешно создан!` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные...');
      }
      if (err.code === 11000 && err.name === 'MongoError') {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      throw err;
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('В базе данных нет пользователей');
      } else {
        res
          .status(200)
          .send({ data: users });
      }
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .orFail(new NotFoundError('Упс! Такого пользователя не существует :('))
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Проверьте валидность идентификатора');
      }
      throw err;
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Необходима авторизация');
    })
    .catch(next);
};
