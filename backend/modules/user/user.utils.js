import bcrypt from "bcrypt";

/*
=========================
HASH PASSWORD
=========================
*/

export const hashPassword =
  async (password) => {
    return await bcrypt.hash(
      password,
      10
    );
  };

/*
=========================
COMPARE PASSWORD
=========================
*/

export const comparePassword =
  async (password, hashed) => {
    return await bcrypt.compare(
      password,
      hashed
    );
  };