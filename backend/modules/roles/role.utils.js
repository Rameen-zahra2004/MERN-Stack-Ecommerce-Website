import {
  ROLE_HIERARCHY,
} from "./role.constants.js";

/*
=========================
CHECK HIERARCHY ACCESS
=========================
*/

export const hasPermission =
  (userRole, requiredRole) => {
    return (
      ROLE_HIERARCHY[userRole] >=
      ROLE_HIERARCHY[requiredRole]
    );
  };