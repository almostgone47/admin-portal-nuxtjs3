import { Strategy as JwtStrategy } from "passport-jwt";
import extractors from "passport-jwt/lib/extract_jwt.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const opts: any = {};
opts.jwtFromRequest = extractors.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  isAuthenticated?: boolean;
}

const passportStrategy = (passport) => {
  // need to send bearer token in auth headers
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      // console.log("PASSPORT:: ", jwt_payload);
      try {
        const user: User = await prisma.user.findFirst({
          where: {
            email: jwt_payload.email,
          },
        });
        // make sure user password can't be retrieved
        delete user.password;

        if (user) {
          user.isAuthenticated = true;
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
};

export default passportStrategy;
