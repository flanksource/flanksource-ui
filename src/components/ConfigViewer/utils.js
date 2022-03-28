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
