const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.delete('/:id', deleteCardById);

router.put('/:id/likes', likeCard);

router.delete('/:id/likes', dislikeCard);

router.get('/', getCards);

module.exports = {
  cardsRouter: router,
};
