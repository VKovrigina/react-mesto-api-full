class UnauthorizedError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.statusCode = 401;
    this.message = message;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
