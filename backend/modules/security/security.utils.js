export const getClientIP = (req) => req.ip;

export const isBotRequest = (req) => {
  const userAgent = req.headers["user-agent"] || "";
  return (
    userAgent.toLowerCase().includes("bot") ||
    userAgent.toLowerCase().includes("crawler") ||
    userAgent === ""
  );
};
