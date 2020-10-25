const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/requestValidation');

router.post('/', validateCreateCard, createCard);

router.delete('/:id', validateCardId, deleteCardById);

router.put('/:id/likes', validateCardId, likeCard);

router.delete('/:id/likes', validateCardId, dislikeCard);

router.get('/', getCards);

module.exports = {
  cardsRouter: router,
};
