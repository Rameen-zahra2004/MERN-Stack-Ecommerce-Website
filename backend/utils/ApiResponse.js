class ApiResponse {
  constructor(
    statusCode,
    data = null,
    message = "success",
    meta = null
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;

    this.success = statusCode < 400;

    if (meta) {
      this.meta = meta;
    }
  }

  toJSON() {
    const response = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };

    if (this.meta) {
      response.meta = this.meta;
    }

    return response;
  }
}

export default ApiResponse;