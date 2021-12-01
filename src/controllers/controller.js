import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { loginService, registerUserService } from "../services/services";

export let register = async (req, res, next) => {
  try {
    // checking for all the fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // we can now register our user
    await registerUserService(req.body);
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

export let login = async (req, res, next) => {
  try {
    // checking for all the fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error_msg", "Please check for empty fields");
      return res.redirect("/login");
    }

    const { email, password } = req.body;
    let user = await loginService({ email });

    if (!user) {
      req.flash("error_msg", "No user found with the provided email");
      return res.redirect("/");
    }

    // comparing the user's password with the stored password from the database
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    // else we have the user with the email provided
    if (!isPasswordMatching) {
      req.flash("error_msg", "Passwor incorrect");
      return res.redirect("/");
    }

    // here we'll have the correct email and password, we can now log the user in
    req.session.auth = true;
    req.session.name = user.name;
    req.session.email = user.email;

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};
