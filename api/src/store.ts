import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { User } from "./types.js";

const DATA_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDataDir(): void {
  const dir = path.dirname(DATA_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function readUsers(): User[] {
  ensureDataDir();
  if (!existsSync(DATA_PATH)) {
    return [];
  }
  const raw = readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw) as { users: User[] };
  return data.users ?? [];
}

function writeUsers(users: User[]): void {
  ensureDataDir();
  writeFileSync(DATA_PATH, JSON.stringify({ users }, null, 2), "utf-8");
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUsername(username: string): User | undefined {
  return readUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function createUser(user: User): User {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

function generateId(): string {
  return String(Date.now()) + Math.random().toString(36).slice(2, 9);
}

export function nextId(): string {
  const users = readUsers();
  let id: string;
  do {
    id = generateId();
  } while (users.some((u) => u.id === id));
  return id;
}
