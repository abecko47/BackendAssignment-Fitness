import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "passport";
import { models } from "../db";
import { JWTPayload } from "../auth/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const { User } = models;

passport.use(
  new JwtStrategy(opts, async (payload: JWTPayload, done) => {
    try {
      const user = await User.findByPk(payload.id);

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
