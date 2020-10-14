const showErrorFunction = (res, err, status) => {
  res
    .status(status)
    .send({ message: `Что-то пошло не так :( Ошибка: ${err}` });
  /* eslint-disable-next-line no-useless-return */
  return;
};

module.exports = {
  showError: showErrorFunction,
};
