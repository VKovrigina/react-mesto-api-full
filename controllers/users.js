const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { showError } = require('../helpers/showError');

module.exports.postUser = (req, res) => {
  const {
    name: userName,
    about: userAbout,
    avatar: userAvatar,
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
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        showError(res, 'Введены некорректные данные', 400);
        return;
      }
      showError(res, err, 500);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        showError(res, 'В базе данных нет пользователей', 404);
      } else {
        res
          .status(200)
          .send({ data: users });
      }
    })
    .catch((err) => {
    /* eslint-disable-next-line no-console */
      console.error(`При запросе данных о пользователях произошла ошибка: ${err}`);
      showError(res, err, 500);
    });
};

module.exports.getUsersById = (req, res) => {
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
        showError(res, 'Проверьте валидность идентификатора', 400);
        return;
      }

      if (err.message === 'NotValidId') {
        showError(res, 'Упс! Такого пользователя не существует :(', 404);
        return;
      }

      showError(res, err, 500);
    });
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
