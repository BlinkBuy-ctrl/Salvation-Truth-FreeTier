import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@st/theme_preference";

export const LIGHT_THEME = {
  mode: "light",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  border: "#E2E8F0",
  navy: "#0F172A",
  gold: "#D97706",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  headerBg: "#F8FAFC",
  tabBarBg: "#FFFFFF",
};

export const DARK_THEME = {
  mode: "dark",
  bg: "#0B1220",
  surface: "#141C2E",
  surfaceAlt: "#1C2438",
  border: "#26314A",
  navy: "#0F172A",
  gold: "#F2A93B",
  textPrimary: "#F1F5F9",
  textSecondary: "#CBD5E1",
  textMuted: "#7C8AA5",
  headerBg: "#0B1220",
  tabBarBg: "#141C2E",
};

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "dark" || stored === "light") setMode(stored);
      setLoaded(true);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setTheme = useCallback((next) => {
    setMode(next);
    AsyncStorage.setItem(THEME_KEY, next);
  }, []);

  const colors = mode === "dark" ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setTheme, isThemeLoaded: loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
