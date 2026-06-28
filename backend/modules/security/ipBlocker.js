const blockedIPs = new Set();

export const blockIP = (ip) => {
  blockedIPs.add(ip);
};

export const ipBlocker = (req, res, next) => {
  const ip = req.ip;

  if (blockedIPs.has(ip)) {
    return res.status(403).json({
      success: false,
      message: "Your IP has been blocked",
    });
  }

  next();
};
