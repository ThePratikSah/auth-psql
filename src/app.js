import flash from "connect-flash";
import connectSession from "connect-session-sequelize";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import Routes from "./routes/routes";
import TodoRoutes from "./routes/todos";
import { strategy } from "./utils/auth";
import sequelize, { PORT } from "./utils/db";
import { googleStrategy } from "./utils/google-auth";
const SequelizeStore = connectSession(session.Store);

const app = express();

// setting up flash message here
app.use(flash());

// session store
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 24 * 60 * 60 * 1000,
    }),
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

strategy(passport);
googleStrategy();

app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  // handle CSRF token errors here
  console.log(req.originalUrl, "Error");
  // req.logout();
  res.redirect("/");
  req.session.destroy();
});

app.use((req, res, next) => {
  // provided by express
  // .locals attaches to every res because they only exist in views that are rendered
  // res.locals.isAuthenticated = req.session.auth;
  // res.locals.name = req.session.name;
  // res.locals.email = req.session.email;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// helmet middleware
app.use(helmet());

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));

// serving static files here
app.use(express.static("public"));

// setting the views as ejs
app.set("view engine", "ejs");

// routes
app.use("/", Routes);
app.use("/todos", TodoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

sequelize
  .sync()
  .then(
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    })
  )
  .catch((e) => console.log(e));
