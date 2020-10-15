const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
// Спасибо большое код-ревьюеру! Хорошего вам дня)
const { PORT = 3000 } = process.env;
const app = express();
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { showError } = require('./helpers/showError');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  message: 'Подозрительно много запросов отправляется  с вашего IP. Вы робот? Если нет, подождите 10 минут :)',
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/cards', cardsRouter);

app.use('/users', usersRouter);

app.all('*', (req, res) => {
  showError(res, 'Запрашиваемый ресурс не найден', 404);
});

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`App listening ${PORT}!!!`);
});
