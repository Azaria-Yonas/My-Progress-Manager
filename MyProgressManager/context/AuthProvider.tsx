import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  AuthService,
  AuthUser,
  LoginPayload,
  SignupPayload,
} from "../services/auth";
import {
  clearToken,
  getToken,
  setToken,
} from "../services/tokenStorage";
import { ApiError } from "../services/api";
import { NotifyService } from "../services/notify";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const me = await AuthService.me();
      setUser(me);
      return me;
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        await clearToken();
        setTokenState(null);
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getToken();
      if (cancelled) return;
      if (!stored) {
        setInitializing(false);
        return;
      }
      setTokenState(stored);
      await refreshUser();
      if (!cancelled) setInitializing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await AuthService.login(payload);
    await setToken(res.access_token);
    setTokenState(res.access_token);
    setUser(res.user);
    NotifyService.reset();
    return res.user;
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const res = await AuthService.signup(payload);
    await setToken(res.access_token);
    setTokenState(res.access_token);
    setUser(res.user);
    NotifyService.reset();
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    await clearToken();
    setTokenState(null);
    setUser(null);
    NotifyService.reset();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, initializing, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
