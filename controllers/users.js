const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('В базе данных нет карточек');
      } else {
        res
          .status(200)
          .send({ data: users });
      }
    })
    .catch((err) => {
    /* eslint-disable-next-line no-console */
      console.error(`При запросе данных о пользователях произошла ошибка: ${err}`);
      if (err.name === 'NotFoundError') {
        next(err);
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(`При запросе данных пользователя по id произошла ошибка: ${err}`);
      if (err.name === 'CastError') {
        throw new BadRequestError('Проверьте валидность идентификатора');
      } else if (err.message === 'NotValidId') {
        throw new NotFoundError('Упс! Такого пользователя не существует :(');
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'bac35ae5904e7869fb863a4a17e1771bb436cf74b141d7bef6d2cbbb7849a689',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Необходима авторизация');
    })
    .catch(next);
};
