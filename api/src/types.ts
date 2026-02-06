export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface SignupBody {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "passwordHash">;
  message: string;
}
