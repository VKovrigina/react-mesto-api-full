const Card = require('../models/card');
const { showError } = require('../helpers/showError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status(200)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        showError(res, 'Введены некорректные данные', 400);
      } else {
        showError(res, err, 500);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      if (cards.length === 0) {
        showError(res, 'В базе данных нет карточек', 500);
        return;
      }
      res
        .status(200)
        .send({ data: cards });
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(`При запросе данных карточек произошла ошибка: ${err}`);
      showError(res, err, 500);
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(`При запросе данных карточки по id произошла ошибка: ${err}`);
      if (err.name === 'CastError') {
        showError(res, 'Проверьте валидность идентификатора', 400);
        return;
      }

      if (err.message === 'NotValidId') {
        showError(res, 'Упс! Запрашиваемая карточка не найдена', 404);
        return;
      }

      showError(res, err, 500);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        showError(res, 'Проверьте валидность идентификатора карточки', 400);
        return;
      }

      if (err.message === 'NotValidId') {
        showError(res, 'Упс! Вы не можете поставить лайк несуществующей карточке', 404);
        return;
      }

      showError(res, err, 500);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        showError(res, 'Проверьте валидность идентификатора карточки', 400);
        return;
      }

      if (err.message === 'NotValidId') {
        showError(res, 'Упс! Вы не можете снять лайк с несуществующей карточки', 404);
        return;
      }

      showError(res, err, 500);
    });
};
