import express from "express";
import { body } from "express-validator";
import passport from "passport";
import { register } from "../controllers/controller";
import User from "../Models/user";
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.user) return res.redirect("/login");
  // this will fetch all the user's email and will show it here in a table
  res.render("index", {
    title: "Dashboard",
    email: req.user.email,
    name: req.user.name,
  });
});

// for loading the login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// for loading the login page
router.get("/register", (req, res) => {
  res.render("signup", { title: "Register" });
});

// registering new user
router.post(
  "/register",
  body("name").isString().not().isEmpty().trim().escape(),
  body("email")
    .isEmail()
    .custom((email) => {
      return User.findOne({
        where: {
          email,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("password").isLength({ min: 6 }),
  register
);

// login user here
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// login with google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// logout user here
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
});

export default router;
