const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate(['owner', 'likes'])
        .then((findedCard) => {
          res
            .status(200)
            .send({ data: findedCard });
        })
        .catch(() => { throw new Error(); })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .populate('owner')
    .then((cards) => {
      if (cards.length === 0) {
        throw new NotFoundError('В базе данных нет карточек');
      }
      res
        .status(200)
        .send({ data: cards });
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(`При запросе данных карточек произошла ошибка: ${err}`);
      if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findOne({ _id: req.params.id })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner._id.equals(req.user._id)) {
        card.remove();
        res
          .status(200)
          .send({ message: 'Карточка удалена.' });
      } else {
        throw new UnauthorizedError('Вы не можете удалить чужую карточку, как бы она вам не нравилась..');
      }
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(`При запросе данных карточки по id произошла ошибка: ${err}`);
      if (err.name === 'CastError') {
        throw new BadRequestError('Проверьте валидность идентификатора');
      } else if (err.message === 'NotValidId') {
        throw new NotFoundError('Упс! Запрашиваемая карточка не найдена');
      } else if (err.name === 'UnauthorizedError') {
        next(err);
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Проверьте валидность идентификатора карточки');
      } else if (err.message === 'NotValidId') {
        throw new NotFoundError('Упс! Вы не можете поставить лайк несуществующей карточке');
      } else {
        throw new Error();
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Проверьте валидность идентификатора карточки');
      } else if (err.message === 'NotValidId') {
        throw new NotFoundError('Упс! Вы не можете снять лайк с несуществующей карточки');
      } else {
        throw new Error();
      }
    })
    .catch(next);
};
