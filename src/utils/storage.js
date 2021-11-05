export function getLocalItem(key) {
  return window.localStorage.getItem(key);
}

export function setLocalItem(key, value) {
  return window.localStorage.setItem(key, value);
}
