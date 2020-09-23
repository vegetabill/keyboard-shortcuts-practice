const { User } = require("../orm");

/**
 * Create a filter to attach the currently logged in user to
 * the request for use by other application logic, independent of
 * the auth mechanism.
 *
 * @param {(Request) => String} userIdCallback - logic to find the user id of logged in user
 */
const build = (userIdCallback) => {
  const isLoggedIn = (req) => !!userIdCallback(req);

  const loginAs = async (userId) => {
    const [user] = await User.findOrCreate({ where: { id: userId } });
    user.last_login = new Date();
    await user.save();
    return user;
  };

  const filter = async (req, res, next) => {
    if (isLoggedIn(req)) {
      const userId = userIdCallback(req);
      const u = await loginAs(userId);
      req.loggedInUser = u;
      res.locals.loggedInUser = u;
    }
    next();
  };

  // bind some helpers we can use elsewhere
  // (only needed by simple-auth)
  filter.isLoggedIn = isLoggedIn;
  filter.loginAs = loginAs;

  return filter;
};

module.exports = build;
