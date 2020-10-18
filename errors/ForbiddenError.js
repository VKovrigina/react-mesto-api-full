class ForbiddenError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.statusCode = 403;
    this.message = message;
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
