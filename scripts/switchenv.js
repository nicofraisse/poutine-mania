const fs = require("fs");

const devEnv = ".env.development";
const prodEnv = ".env.production";

const devEnvContent = fs.readFileSync(devEnv, "utf8");
const prodEnvContent = fs.readFileSync(prodEnv, "utf8");

fs.writeFileSync(devEnv, prodEnvContent);
fs.writeFileSync(prodEnv, devEnvContent);

const newDevContent = fs.readFileSync(devEnv, "utf8");

const isNowUsingProd =
  newDevContent.includes("production") ||
  newDevContent.includes("prod") ||
  newDevContent.includes("PRODUCTION") ||
  newDevContent.includes("PROD");

console.log(
  `✅ Environment variables switched: now using ${
    isNowUsingProd ? "PRODUCTION" : "DEVELOPMENT"
  } environment in development.`
);
