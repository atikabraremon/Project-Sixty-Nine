class ApiResponse {
  constructor({
    statusCode = 200,
    data = null,
    message = "Success",
    meta = null,
  }) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export { ApiResponse };
