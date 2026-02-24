import util from "util";
import crypto from "crypto";
import { createClient } from "redis";
import type { CookieOptions, NextFunction, Request, Response } from "express";

import RedisStore from "./redis-store";

const randomBytes = util.promisify(crypto.randomBytes);

const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

type SessionConfig = {
  name: string;
  cookie: CookieOptions;
};

const MAX_AGE = 60 * 60 * 1000; // 1 hour
export class SessionManager {
  private readonly encoding: crypto.BinaryToTextEncoding = "base64url";
  private readonly redisStore = new RedisStore(redisClient);
  public sessionId: string;
  public readonly isNew: boolean;
  private modified: boolean = false;

  constructor(
    public readonly config: SessionConfig,
    cookies: Record<string, string>,
  ) {
    if (cookies[this.config.name]) {
      this.sessionId = cookies[this.config.name];
      this.isNew = false;
    } else {
      this.sessionId = crypto.randomBytes(32).toString(this.encoding);
      this.isNew = true;
    }
  }

  public get shouldSave(): boolean {
    return !this.isNew || this.modified;
  }

  private getTtl(): number {
    return this.config.cookie.maxAge ?? MAX_AGE;
  }

  get data(): Promise<unknown> {
    return this.getData(); 
  }

  set data(value: unknown) {
    this.setData(value);
  }

  private async getData(): Promise<unknown> {
    const raw = await this.redisStore.get(this.sessionId);
    return raw ? JSON.parse(raw) : null;
  }

  private async setData(data: unknown): Promise<void> {
    this.modified = true;
    await this.redisStore.set(this.sessionId, JSON.stringify(data), this.getTtl());
  }

  private async generateSessionId(): Promise<string> {
    const bytes = await randomBytes(32);
    return bytes.toString(this.encoding);
  }

  public async regenerate(): Promise<string> {
    await this.redisStore.destroy(this.sessionId);
    this.sessionId = await this.generateSessionId();
    return this.sessionId;
  }

  public async destroy(): Promise<void> {
    await this.redisStore.destroy(this.sessionId);
  }
}

const accessSessionConfig: SessionConfig = {
  name: "id",
  cookie: {
    path: "/",
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    domain: "localhost",
    secure: process.env.NODE_ENV === "production",
  },
};

const refreshSessionConfig: SessionConfig = {
  name: "rid",
  cookie: {
    path: "/",
    signed: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export default async function authSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const accessSession = new SessionManager(accessSessionConfig, req.signedCookies);
  const refreshSession = new SessionManager(refreshSessionConfig, req.signedCookies);

  req.accessSession = accessSession;
  req.refreshSession = refreshSession;

  const originalEnd = res.end.bind(res);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (res as any).end = function (...args: unknown[]) {
    if (accessSession.shouldSave) {
      res.cookie(accessSession.config.name, accessSession.sessionId, accessSession.config.cookie);
    }
    if (refreshSession.shouldSave) {
      res.cookie(refreshSession.config.name, refreshSession.sessionId, refreshSession.config.cookie);
    }
    return (originalEnd as (...a: unknown[]) => unknown)(...args);
  };

  next();
}
