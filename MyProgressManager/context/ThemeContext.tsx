// context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: {
    primary: string;
    background: string;
    text: string;
    success: string;
    danger: string;
    shadowcolor: string;
    card: string;
  };
  paperTheme: any;
  bgImage: null; 
  currentTheme: ThemeMode;
  overrideTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setCurrentTheme(saved);
      }
    });
  }, []);

  const overrideTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    AsyncStorage.setItem("themeMode", mode);
  };

  const dark =
    currentTheme === "dark" ||
    (currentTheme === "system" && systemScheme === "dark");

  const theme = dark
    ? {
        primary: "#5a57ba",
        background: "#212121ff",
        text: "#FFFFFF",
        input: "#373737ff",
        success: "#2ecc71",
        danger: "#e74c3c",
        shadowcolor: "#FFF",
        card: "#3e3e3eff",
      }
    : {
        primary: "#6AB5DE",
        background: "#FFF",
        text: "#212121",
        input: "#eaeaeaff",
        success: "#2ecc71",
        danger: "#e74c3c",
        shadowcolor: "#000000",
        card: "#dedede",
      };

  const paperTheme = {
    ...(dark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(dark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: theme.primary,
      background: theme.background,
      surface: theme.card,
      text: theme.text,
      onBackground: theme.text,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        bgImage: null, 
        paperTheme,
        currentTheme,
        overrideTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used inside ThemeProvider");
  return ctx;
}
