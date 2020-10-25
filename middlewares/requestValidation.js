const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(1).max(30),
    link: Joi.string().regex(/^(?:(?:https?|HTTPS?):\/\/)(?:\S+(?::\S*)?@)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
  }),
});

const validateEditProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(40),
  }),
});

const validateEditAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(?:(?:https?|HTTPS?):\/\/)(?:\S+(?::\S*)?@)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validateCreateCard,
  validateEditProfile,
  validateEditAvatar,
  validateCardId,
  validateUserId,
};
