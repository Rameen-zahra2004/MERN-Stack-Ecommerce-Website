class ApiError extends Error {
  constructor(
    statusCode,
    message,
    isOperational = true,
    stack = ""
  ) {
    super(message);

    /*
    =========================
    BASIC ERROR INFO
    =========================
    */
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;

    /*
    =========================
    STACK TRACE HANDLING
    =========================
    */
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(
        this,
        this.constructor
      );
    }
  }

  /*
  =========================
  JSON SAFE OUTPUT
  =========================
  */
  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      isOperational: this.isOperational,
      stack: this.stack,
    };
  }
}

export default ApiError;