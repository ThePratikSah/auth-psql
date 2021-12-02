import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../Models/user";

// configuring dotenv for ENV variable(s)
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const googleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        // we can check if the user exists in the database or not
        // if the user exists, we can log them in
        // if user is not registered, we can register them here and store them in the database
        let user = await User.findOne({
          where: {
            email: profile.email,
          },
        });

        if (!user) {
          const { displayName, email } = profile;
          // create new user account with the details
          user = await User.create({
            name: displayName,
            email,
            isVerified: true,
          });
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
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
