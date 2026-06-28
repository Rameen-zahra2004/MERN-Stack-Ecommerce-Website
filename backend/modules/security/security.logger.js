import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), "logs", "security.log");

if (!fs.existsSync(path.dirname(LOG_PATH))) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
}

export const logSecurityEvent = (event, data) => {
  const log = { event, data, timestamp: new Date() };

  fs.appendFile(LOG_PATH, JSON.stringify(log) + "\n", (err) => {
    if (err) {
      console.error("[Security] Failed to write security log:", err.message);
    }
  });
};
