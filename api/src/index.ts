import cors from "cors";
import crypto from "crypto";
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = 1234;

const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

const sessionStore = new RedisStore({
  client: redisClient,
  ttl: 60 * 60, // 1 hour
});

app.use(
  cors({
    maxAge: 60 * 60, //cache preflight request for 1 minute
    origin: true, // reflect caller origin
    credentials: true, // allow cookies / Authorization headers
  }),
);

app.use(express.json());

// TODO: implement HSTS

// app.use(
//   session({
//     name: "id", // provide a generic name to avoid name fingerprinting.
//     secret: crypto.randomBytes(32).toString("hex"), // 256 bits of entropy. 32 bytes of cryptographically secure random bytes
//     resave: false,
//     rolling: true,
//     store: sessionStore,
//     saveUninitialized: false,
//     cookie: {
//       domain: "localhost", // ommit domain when ever possible to prevent cross-site cookie access.
//       path: "/", // always set appropriate path to narrow down the attack vector.
//       httpOnly: true, // prevent JavaScript from accessing the cookie to prevent XSS attacks.
//       secure: process.env.NODE_ENV === "production", // always serve cookies over secure connections (HTTPS) to prevent MITM attacks.
//       sameSite: "lax", // good default. cookies only sent in same-site and cross-site safe requests.
//     },
//   }),
// );

const refreshTokenSession = session({
  name: "rid",
  secret: crypto.randomBytes(32).toString("hex"),
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    // domain: "localhost", // ommit domain for refresh token. only send to the origin server
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

app.use(refreshTokenSession);

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
