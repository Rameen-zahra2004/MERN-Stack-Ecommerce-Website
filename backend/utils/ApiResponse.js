class ApiResponse {
  constructor(
    statusCode,
    data = null,
    message = "success",
    meta = null
  ) {
    /*
    =========================
    CORE RESPONSE DATA
    =========================
    */
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;

    /*
    =========================
    SUCCESS FLAG
    =========================
    */
    this.success = statusCode < 400;

    /*
    =========================
    OPTIONAL METADATA
    (pagination, counts, etc.)
    =========================
    */
    if (meta) {
      this.meta = meta;
    }
  }

  /*
  =========================
  FORMAT OUTPUT (SAFE JSON)
  =========================
  */
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