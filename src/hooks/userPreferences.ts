import { useMemo } from "react";

export default function usePreferences<T>(key: string) {
  const preferences = useMemo<T>(() => {
    const data = sessionStorage.getItem(key) || "{}";
    try {
      return JSON.parse(data!);
    } catch (ex) {
      return {};
    }
  }, [key]);

  const storePreferences = (data: T) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  };

  return {
    storePreferences,
    preferences
  };
}
