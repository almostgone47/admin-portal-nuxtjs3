import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
// Passport is Express-compatible authentication middleware for Node.js.
import passportConfig from "../../config/passport";

const prisma = new PrismaClient();
const app = express();

// Passport is Express auth middleware
app.use(passport.initialize());
passportConfig(passport);

app.use(express.json());

app.get(`/api/test`, (req, res) => {
  res.send("the api works!!");
});

app.post(`/api/register`, async (req, res) => {
  // if user already exists return error msg
  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    return res.status(400).json({ msg: "Invalid email. User already exists." });
  }
  // else create new user with hashed password
  const newUser = {
    username: req.body.username,
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password, // This will be a hash
  };
  // Generate hash for password to secure saved password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      // create new user
      const payload: any = await prisma.user.create({
        data: { ...newUser },
      });
      // remove password from payload and set authenticated
      delete payload.password;
      payload.isAuthenticated = true;

      // return signed jwt tokent to client side
      jwt.sign(
        payload,
        process.env.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          return res.status(200).json({
            jwtToken: "Bearer " + token,
            user: payload,
          });
        }
      );
    });
  });
});

app.post(`/api/login`, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (user) {
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (user && isMatch) {
      // User matched, create JWT Payload
      const payload = {
        email: user.email,
      };
      // Sign token (expires in 1 hour or 3600 seconds)
      jwt.sign(
        payload,
        process.env.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          return res.status(200).json({
            success: true,
            jwtToken: "Bearer " + token,
            user: payload,
          });
        }
      );
    } else {
      return res.status(400).json({ msg: "Incorrect login information" });
    }
  }
});

app.get(
  "/api/current-user",
  passport.authenticate("jwt", { session: false }),
  (req: any, res) => {
    res.json({ user: req.user });
  }
);

export default {
  path: "/api",
  handler: app,
};
