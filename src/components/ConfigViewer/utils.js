export function hasStringMatch(pattern, text) {
  if (text == null) {
    return false;
  }
  return text.indexOf(pattern) >= 0;
}

export function escapeQuotes(string) {
  return string.replace(/"/g, '\\"');
}

export function unescapeQuotes(string) {
  return string.replace(/\\"/g, '"');
}
