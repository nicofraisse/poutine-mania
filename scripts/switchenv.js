const fs = require("fs");

const devEnv = ".env.development";
const prodEnv = ".env.production";

const devEnvContent = fs.readFileSync(devEnv, "utf8");
const prodEnvContent = fs.readFileSync(prodEnv, "utf8");

fs.writeFileSync(devEnv, prodEnvContent);
fs.writeFileSync(prodEnv, devEnvContent);

console.log(
  `Environment variables switched: now using ${prodEnv} in development.`
);
