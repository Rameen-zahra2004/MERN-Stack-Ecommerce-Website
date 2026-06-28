import User from "./User.model.js";

import { hashPassword } from "./user.utils.js";

import { USER_MESSAGES } from "./user.constants.js";

/*
=========================
CREATE USER
=========================
*/

export const createUserService = async (payload) => {
  const hashed = await hashPassword(payload.password);

  const user = await User.create({
    ...payload,
    password: hashed,
  });

  return user;
};

/*
=========================
GET USER BY ID
=========================
*/

export const getUserByIdService = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error(USER_MESSAGES.NOT_FOUND);
  }

  return user;
};

/*
=========================
GET ALL USERS (ADMIN)
=========================
*/

export const getUsersService = async (query) => {
  const { page = 1, limit = 10, role } = query;

  const filter = {};

  if (role) filter.role = role;

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return users;
};

/*
=========================
UPDATE USER
=========================
*/

export const updateUserService = async (id, payload) => {
  const user = await User.findByIdAndUpdate(id, payload, { new: true });

  if (!user) {
    throw new Error(USER_MESSAGES.NOT_FOUND);
  }

  return user;
};

/*
=========================
DELETE USER (SOFT)
=========================
*/

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!user) {
    throw new Error(USER_MESSAGES.NOT_FOUND);
  }

  return user;
};
