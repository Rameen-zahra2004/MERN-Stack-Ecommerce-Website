export const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress
  );
};

/*
=========================
DETECT BOT TRAFFIC
=========================
*/

export const isBotRequest = (req) => {
  const userAgent =
    req.headers["user-agent"] || "";

  return (
    userAgent.includes("bot") ||
    userAgent.includes("crawler") ||
    userAgent === ""
  );
};