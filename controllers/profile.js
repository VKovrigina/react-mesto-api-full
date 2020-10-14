const User = require('../models/user');
const { showError } = require('../helpers/showError');

module.exports.editProfile = (req, res) => {
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
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        showError(res, 'Введены некорректные данные', 400);
      } else {
        showError(res, err, 500);
      }
    });
};

module.exports.editAvatar = (req, res) => {
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
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        showError(res, 'Введены некорректные данные', 400);
      } else {
        showError(res, err, 500);
      }
    });
};
