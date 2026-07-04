import {
  ROLE_HIERARCHY,
} from "./role.constants.js";


export const hasPermission =
  (userRole, requiredRole) => {
    return (
      ROLE_HIERARCHY[userRole] >=
      ROLE_HIERARCHY[requiredRole]
    );
  };