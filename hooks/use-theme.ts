import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tm-theme";

function initialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === "dark";
  } catch { /* storage unavailable */ }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light"); } catch { /* storage unavailable */ }
  }, [dark]);

  const toggle = useCallback(() => setDark((value) => !value), []);
  return { dark, toggle };
}
