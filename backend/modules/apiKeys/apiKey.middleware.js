import {
  validateApiKeyService,
} from "./apiKey.service.js";

/*
=========================
API KEY AUTH MIDDLEWARE
=========================
*/

const apiKeyAuth =
  async (req, res, next) => {
    try {
      const apiKey =
        req.headers["x-api-key"];

      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message:
            "API key is required",
        });
      }

      const validatedKey =
        await validateApiKeyService(
          apiKey
        );

      req.apiKey = validatedKey;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };

export default apiKeyAuth;