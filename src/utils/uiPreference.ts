export const NEW_UI_COOKIE = "flanksource_use_new_ui";

export function isNewUIPreferred(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c === `${NEW_UI_COOKIE}=true`);
}

export function setNewUIPreference(value: boolean): void {
  if (typeof document === "undefined") return;
  if (value) {
    document.cookie = `${NEW_UI_COOKIE}=true; path=/; max-age=${60 * 60 * 24 * 365}`;
  } else {
    document.cookie = `${NEW_UI_COOKIE}=; path=/; max-age=0`;
  }
}
