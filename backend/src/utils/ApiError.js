class ApiError extends Error {
  constructor({
    statusCode = 500,
    message = "Something went wrong",
    code = "INTERNAL_ERROR",
    errors = [],
  }) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.code = code;
    this.errors = errors;
    this.data = null;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
