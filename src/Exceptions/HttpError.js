module.exports = class HttpError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unauthorized() {
    return new HttpError(
      401,
      "The user is not authorized to perform requested actions."
    );
  }

  static badRequest(message, errors = []) {
    return new HttpError(400, message, errors);
  }
};
