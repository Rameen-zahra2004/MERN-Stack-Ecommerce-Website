const blockedIPs = new Set();

/*
=========================
BLOCK IP
=========================
*/

export const blockIP = (ip) => {
  blockedIPs.add(ip);
};

/*
=========================
CHECK IP
=========================
*/

export const ipBlocker = (
  req,
  res,
  next
) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  if (blockedIPs.has(ip)) {
    return res.status(403).json({
      success: false,
      message:
        "Your IP has been blocked",
    });
  }

  next();
};