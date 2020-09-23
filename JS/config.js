require("dotenv").config();

const {
  DB_URL,
  NODE_ENV,
  AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL,
  AUTH0_ISSUER_BASE_URL,
} = process.env;

const isProduction = () => NODE_ENV === "production";
const isDevelopment = () => NODE_ENV === "development";

const getDefaultDbUrl = () => {
  if (isDevelopment()) {
    return "sqlite:dev-db.sqlite";
  }
  throw new Error("DB_URL must be specified in production mode");
};

const auth0Enabled = !!AUTH0_CLIENT_ID;

const auth0Config = auth0Enabled && {
  clientID: AUTH0_CLIENT_ID,
  secret: AUTH0_CLIENT_SECRET,
  baseURL: AUTH0_BASE_URL || "http://localhost:3000",
  issuerBaseURL: AUTH0_ISSUER_BASE_URL,
};

module.exports = {
  isProduction,
  isDevelopment,
  DB_URL: DB_URL || getDefaultDbUrl(),
  auth0Enabled,
  auth0Config,
};
