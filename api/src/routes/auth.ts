import { Router, Request, Response } from "express";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    res.send("Login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not sign in",
    });
  }
});

authRouter.post("/logout", (req: Request, res: Response): void => {
  if (!req.session) {
    res.status(200).json({ message: "Logged out" });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      res.status(500).json({
        error: "Internal server error",
        message: "Could not log out",
      });
      return;
    }

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
});
