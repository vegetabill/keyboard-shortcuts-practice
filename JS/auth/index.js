const { auth0Enabled } = require("../config");
const { useSimpleAuth } = require("./simple-auth");
const { useAuth0 } = require("./auth0");

/**
 *
 * The currently logged-in User model object for
 * the request will be available in:
 *
 * - req.loggedInUser
 * - res.locals.loggedInUser
 */

const configureAuth = (expressApp) => {
  if (auth0Enabled) {
    useAuth0(expressApp);
  } else {
    useSimpleAuth(expressApp);
  }
};

module.exports = {
  configureAuth,
};
