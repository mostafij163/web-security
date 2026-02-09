import { Router, Request, Response } from "express";

export const authRouter = Router();

// authRouter.post("/signup", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const body = req.body as SignupBody;
//     const { username, email, password, name } = body;

//     if (!username?.trim() || !email?.trim() || !password) {
//       res.status(400).json({
//         error: "Missing required fields",
//         message: "username, email, and password are required",
//       });
//       return;
//     }

//     if (password.length < 8) {
//       res.status(400).json({
//         error: "Invalid password",
//         message: "Password must be at least 8 characters",
//       });
//       return;
//     }

//     const existingByEmail = findUserByEmail(email);
//     if (existingByEmail) {
//       res.status(409).json({
//         error: "Conflict",
//         message: "An account with this email already exists",
//       });
//       return;
//     }

//     const existingByUsername = findUserByUsername(username);
//     if (existingByUsername) {
//       res.status(409).json({
//         error: "Conflict",
//         message: "Username is already taken",
//       });
//       return;
//     }

//     const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = createUser({
//       id: nextId(),
//       username: username.trim(),
//       email: email.trim().toLowerCase(),
//       passwordHash,
//       name: (name ?? username).trim(),
//       createdAt: new Date().toISOString(),
//     });

//     // Automatically log the user in by creating a session
//     if (req.session) {
//       req.session.userId = user.id;
//     }

//     const response: AuthResponse = {
//       user: sanitizeUser(user),
//       message: "Account created successfully",
//     };
//     res.status(201).json(response);
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({
//       error: "Internal server error",
//       message: "Could not create account",
//     });
//   }
// });

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(req.session);

    req.session.user = {
      id: "1",
      username: "test",
      email: "test@test.com",
      name: "Test User",
    };

    // if (!email?.trim() || !password) {
    //   res.status(400).json({
    //     error: "Missing required fields",
    //     message: "email and password are required",
    //   });
    //   return;
    // }

    // const user = findUserByEmail(email.trim());
    // if (!user) {
    //   res.status(401).json({
    //     error: "Unauthorized",
    //     message: "Invalid email or password",
    //   });
    //   return;
    // }

    // const match = await bcrypt.compare(password, user.passwordHash);
    // if (!match) {
    //   res.status(401).json({
    //     error: "Unauthorized",
    //     message: "Invalid email or password",
    //   });
    //   return;
    // }

    // if (req.session) {
    //   req.session.userId = user.id;
    // }

    // const response: AuthResponse = {
    //   user: sanitizeUser(user),
    //   message: "Login successful",
    // };
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
