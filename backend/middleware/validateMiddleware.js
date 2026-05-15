export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      /*
      =========================
      CHOOSE SOURCE (body/query/params)
      =========================
      */
      const data = req[property];

      const parsed =
        schema.parse(data);

      /*
      =========================
      ATTACH CLEAN DATA BACK TO REQUEST
      =========================
      */
      req[property] = parsed;

      next();
    } catch (error) {
      /*
      =========================
      ZOD ERROR NORMALIZATION
      =========================
      */

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