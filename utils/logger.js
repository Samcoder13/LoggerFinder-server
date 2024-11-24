const { createLogger, transports, format } = require("winston");
const logger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json()
      ),
    }),
  ],
});

module.exports = logger;
