import cors from "cors";
import crypto from "crypto";
import express from "express";
import session from "express-session";

import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = 1234;
const SESSION_SECRET = crypto.randomBytes(32).toString("hex"); // 256 bits of entropy. 32 bytes of cryptographically secure random bytes.

// In dev we can trust the first proxy (e.g. when behind Next dev server / reverse proxy)
app.set("trust proxy", 1);

app.use(
  cors({
    maxAge: 60 * 60, //cache preflight request for 1 minute
    origin: true, // reflect caller origin
    credentials: true, // allow cookies / Authorization headers
  }),
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: "localhost", // ommit domain when ever possible to prevent cross-site cookie access.
      path: "/", // always set path to narrow down the attack vector.
      httpOnly: true, // prevent JavaScript from accessing the cookie to prevent XSS attacks.
      secure: process.env.NODE_ENV === "production", // set to true when serving over HTTPS to prevent MITM attacks.
      sameSite: "lax",
    },
  }),
);

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
