// services/auth.ts



import { api } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  created_at?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const AuthService = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>("/login", payload, { auth: false });
  },

  signup(payload: SignupPayload) {
    return api.post<AuthResponse>("/signup", payload, { auth: false });
  },

  me() {
    return api.get<AuthUser>("/me");
  },

  logout() {
    return api.post<void>("/logout").catch(() => {
    });
  },
};
