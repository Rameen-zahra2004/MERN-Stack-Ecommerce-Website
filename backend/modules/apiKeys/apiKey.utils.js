import crypto from "crypto";

/*
=========================
GENERATE API KEY
=========================
*/

export const generateApiKey =
  () => {
    return crypto.randomBytes(32)
      .toString("hex");
  };

/*
=========================
HASH API KEY
=========================
*/

export const hashApiKey = (
  key
) => {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
};