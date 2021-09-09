const pino = require("pino");
const { EOL } = require("os");
const levelMapping = { 50: "error", 40: "warning", 30: "info", 20: "debug" };

const logger = pino({
  level: process.env.LOG_LEVEL,
  prettyPrint: {},
  prettifier: (opts) => {
    return (inputData) => {
      const ts = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
      const line = `${ts} ${levelMapping[inputData.level]}: ${
        inputData.msg
      } ${EOL}`;
      return line;
    };
  },
});

module.exports = { logger };
