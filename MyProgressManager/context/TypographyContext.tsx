// context/TypographyContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TypographyMode = "default" | "bold" | "large";

interface TypographyContextType {
  mode: TypographyMode;
  setMode: (m: TypographyMode) => void;
  fontSize: (base: number) => number;
  fontWeight: () => "normal" | "700";
}

const TypographyContext = createContext<TypographyContextType | null>(null);

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<TypographyMode>("default");

  useEffect(() => {
    AsyncStorage.getItem("typographyMode").then((saved) => {
      if (saved === "default" || saved === "bold" || saved === "large") {
        setModeState(saved);
      }
    });
  }, []);

  function setMode(newMode: TypographyMode) {
    setModeState(newMode);
    AsyncStorage.setItem("typographyMode", newMode);
  }

  function fontSize(base: number) {
    if (mode === "large") return base * 1.25;
    return base;
  }

  function fontWeight() {
    if (mode === "bold" || mode === "large") return "700";
    return "normal";
  }

  return (
    <TypographyContext.Provider value={{ mode, setMode, fontSize, fontWeight }}>
      {children}
    </TypographyContext.Provider>
  );
}

export const useTypography = () => {
  const ctx = useContext(TypographyContext);
  if (!ctx) throw new Error("useTypography must be used inside TypographyProvider");
  return ctx;
};
