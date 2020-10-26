const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');

module.exports.editProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res
      .status(200)
      .send({
        name: user.name,
        about: user.about,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res
      .status(200)
      .send({
        avatar: user.avatar,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res
      .status(200)
      .send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
    .catch((err) => {
      throw err;
    })
    .catch(next);
};
