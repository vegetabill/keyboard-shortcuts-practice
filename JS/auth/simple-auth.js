const cookieSession = require("cookie-session");
const buildUserRequestFilter = require("./user-request-filter");

/**
 * Dummy impl for local development unrelated to Auth0
 * so all contributors don't need to set up an Auth0 account.
 * If you're actually changing authentication, you'll need to
 * use the real production implementation below.
 */
const useSimpleAuth = (app) => {
  console.debug("using simple-auth");
  app.use(
    cookieSession({
      name: "session",
      maxAge: 30 * 60 * 1000, // 30 min
      keys: ["kb-practice"],
    })
  );

  const publicRoutes = new Set(["/login", "/logout"]);

  const userRequestFilter = buildUserRequestFilter(
    (req) => req.session.user_id
  );
  app.use(userRequestFilter);
  const { isLoggedIn, loginAs } = userRequestFilter;

  const authFilter = async (req, res, next) => {
    if (!publicRoutes.has(req.path) && !isLoggedIn(req)) {
      return res.redirect("/login");
    }
    next();
  };

  app.use(authFilter);
  app.get("/login", (req, res) => {
    if (isLoggedIn(req)) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });
  app.post("/login", async (req, res) => {
    const { user_id } = req.body;
    const user = await loginAs(user_id);
    req.session.user_id = user.id;
    res.sendStatus(200);
  });
  app.get("/logout", (req, res) => {
    req.session = null;
    res.render("logout");
  });
};

module.exports = { useSimpleAuth };
