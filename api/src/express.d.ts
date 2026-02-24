import type { SessionManager } from "./utils/session";

declare module "express-session" {
  interface SessionData {
    data: unknown;
  }
}

declare global {
  namespace Express {
    interface Request {
      accessSession: SessionManager;
      refreshSession: SessionManager;
    }
  }
}
