class ConflictError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.statusCode = 409;
    this.message = message;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
