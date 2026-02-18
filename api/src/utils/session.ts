import crypto from "crypto";
import { createClient } from "redis";
import RedisStore from "./redis-store";
import type { CookieOptions, NextFunction, Request, Response } from "express";

const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

type SessionConfig = {
  name: string;
  cookie: CookieOptions;
};

const accessSessionConfig: SessionConfig = {
  name: "id",
  cookie: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    signed: true,
  },
};

export default class SessionManager {
  private readonly encoding: crypto.BinaryToTextEncoding = "base64url";
  private readonly redisStore = new RedisStore(redisClient);
  public sessionId: string;

  constructor(
    public readonly config: SessionConfig,
    cookies: Record<string, string>,
  ) {
    if (cookies[this.config.name]) {
      this.sessionId = cookies[this.config.name];
    } else {
      this.sessionId = crypto.randomBytes(32).toString(this.encoding);
    }
  }

  private async getData(): Promise<unknown> {
    const raw = await this.redisStore.get(this.sessionId);
    return raw ? JSON.parse(raw) : null;
  }

  private async setData(data: unknown): Promise<void> {
    const ttl = this.config.cookie.maxAge ?? 60 * 60;
    await this.redisStore.set(this.sessionId, JSON.stringify(data), ttl);
  }

  get data(): Promise<unknown> {
    return this.getData();
  }

  set data(value: unknown) {
    this.setData(value);
  }
}

export async function authSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const accessSession = new SessionManager(
    accessSessionConfig,
    req.signedCookies,
  );

  res.cookie(
    accessSession.config.name,
    accessSession.sessionId,
    accessSession.config.cookie,
  );
  
  next();
}
