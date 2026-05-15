import {
  ROLE_HIERARCHY,
} from "./role.constants.js";

/*
=========================
ROLE AUTHORIZATION MIDDLEWARE
=========================
*/

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is set by authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export default authorizeRoles;