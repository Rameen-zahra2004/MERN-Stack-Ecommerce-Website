export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      const data = req[property];

      const parsed =
        schema.parse(data);

      req[property] = parsed;

      next();
    } catch (error) {

      const formattedErrors =
        error?.errors?.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })) || [
          {
            message:
              "Invalid request data",
          },
        ];

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formattedErrors,
      });
    }
  };