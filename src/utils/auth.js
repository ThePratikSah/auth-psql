import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../Models/user";

export const strategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({
            where: {
              email: username,
            },
            raw: true,
          });
          // return false if no user found
          if (!user) {
            return done(null, false, { message: "No user with that email" });
          }
          // check for valid password
          const isValidPass = await bcrypt.compare(password, user.password);
          if (!isValidPass) {
            return done(null, false, { message: "Password incorrect" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user) return done(null, user.id);
    return done(null, false);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
