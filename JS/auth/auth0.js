const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const { auth0Config } = require("../config");
const buildUserRequestFilter = require("./user-request-filter");

const useAuth0 = (app) => {
  const config = {
    authRequired: true,
    auth0Logout: true,
    ...auth0Config,
  };
  app.use(auth(config));
  console.debug("using Auth0");
  const userRequestFilter = buildUserRequestFilter(
    (req) => req.oidc.user && req.oidc.user.sub
  );
  app.use(userRequestFilter);
  app.get("/profile", requiresAuth(), (req, res) => {
    res.send(req.oidc.user);
  });
};

module.exports = { useAuth0 };
