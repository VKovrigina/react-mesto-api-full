const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
require('dotenv').config();
const cors = require('cors');
// Спасибо большое код-ревьюеру! Хорошего вам дня)
// и спасибо большое за скриншоты ошибок, они очень выручили :)
const { PORT = 3000 } = process.env;
const app = express();
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError.js');
const auth = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  message: 'Подозрительно много запросов отправляется  с вашего IP. Вы робот? Если нет, подождите 10 минут :)',
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);

app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/cards', cardsRouter);

app.use('/users', usersRouter);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`App listening ${PORT}!!!`);
});
