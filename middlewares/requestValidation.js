const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(40),
    avatar: Joi.string().regex(/^(?:(?:https?|HTTPS?):\/\/)(?:\S+(?::\S*)?@)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
};
