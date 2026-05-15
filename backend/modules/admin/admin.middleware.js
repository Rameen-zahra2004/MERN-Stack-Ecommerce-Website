export const authorizePermissions =
  (...permissions) =>
  (req, res, next) => {
    const userPermissions =
      req.user?.permissions || [];

    const hasPermission =
      permissions.some(
        (permission) =>
          userPermissions.includes(
            permission
          )
      );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Insufficient permissions.",
      });
    }

    next();
  };