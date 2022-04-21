import { isEmpty } from "lodash";

export function filterConfigsByText(configs, textQuery) {
  if (configs == null) {
    return [];
  }
  if (isEmpty(textQuery)) {
    return configs;
  }
  const text = textQuery.toLowerCase();
  const filtered = [...configs].filter((config) => {
    const match =
      hasStringMatch(text, config.name?.toLowerCase()) ||
      hasStringMatch(text, config.config_type?.toLowerCase()) ||
      hasStringMatch(text, config.description?.toLowerCase()) ||
      hasStringMatch(text, config.namespace?.toLowerCase());
    return match;
  });
  return filtered;
}

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
