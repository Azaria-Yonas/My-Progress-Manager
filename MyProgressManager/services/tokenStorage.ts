// services/tokenStorage.ts



import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants/config";

let cachedToken: string | null | undefined = undefined;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  const value = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  cachedToken = value;
  return value;
}

export async function setToken(token: string): Promise<void> {
  cachedToken = token;
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export async function clearToken(): Promise<void> {
  cachedToken = null;
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getCachedToken(): string | null {
  return cachedToken ?? null;
}
