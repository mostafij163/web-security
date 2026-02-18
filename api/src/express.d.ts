import type SessionManager from "./utils/session.js";

declare global {
  namespace Express {
    interface Request {
      accessSession: SessionManager;
      refreshSession: SessionManager;
    }
  }
}
