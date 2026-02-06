import express from "express";
import cors from "cors";
import session from "express-session";
import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT ?? 3001;
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-insecure-session-secret-change-me";

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
      httpOnly: true,
      secure: false, // set to true when serving over HTTPS
      sameSite: "lax",
    },
  }),
);

app.use(express.json());

app.use("/auth", authRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
