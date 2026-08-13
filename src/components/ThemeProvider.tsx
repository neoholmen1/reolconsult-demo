"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeCtx = createContext<Ctx>({ theme: "light", toggle: () => {}, setTheme: () => {} });

/** Rydder opp forrige overgang hvis brukeren klikker toggelen raskt to ganger. */
let skifteTimer = 0;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Synk fra klassen som pre-paint-scriptet allerede satte (unngår flash).
  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const apply = useCallback((t: Theme) => {
    const rot = document.documentElement;

    // Fargeovergangen skrus på rett før byttet og av igjen etterpå, så den
    // koster bare i det halvsekundet den faktisk brukes. Se .tema-skifter.
    rot.classList.add("tema-skifter");
    window.clearTimeout(skifteTimer);
    skifteTimer = window.setTimeout(() => rot.classList.remove("tema-skifter"), 420);

    rot.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("theme", t);
    } catch {}
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    apply(document.documentElement.classList.contains("dark") ? "light" : "dark");
  }, [apply]);

  return <ThemeCtx value={{ theme, toggle, setTheme: apply }}>{children}</ThemeCtx>;
}

export const useTheme = () => useContext(ThemeCtx);
