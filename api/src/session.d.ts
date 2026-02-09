import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: Partial<{
      id: string;
      username: string;
      email: string;
      name: string;
      createdAt: string;
    }>;
  }
}

