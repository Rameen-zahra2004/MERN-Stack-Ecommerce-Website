import fs from "fs";

/*
=========================
SECURITY LOGGING SYSTEM
=========================
*/

export const logSecurityEvent =
  (event, data) => {
    const log = {
      event,
      data,
      timestamp: new Date(),
    };

    fs.appendFileSync(
      "security.log",
      JSON.stringify(log) + "\n"
    );
  };