import { parse } from "qs";
import sanitizeHtml from "sanitize-html";

export function toFixedIfNecessary(value: string, dp: number) {
  return +parseFloat(value).toFixed(dp);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function searchParamsToObj(searchParams: Record<string, string>) {
  return parse(searchParams.toString());
}

export function toQueryString(paramsObject: Record<string, string>) {
  return Object.keys(paramsObject)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`
    )
    .join("&");
}

export const sanitizeHTMLContent = (htmlString: string) => {
  return sanitizeHtml(htmlString, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      "*": ["style", "class"]
    }
  });
};

export const sanitizeHTMLContentToText = (htmlString: string) => {
  const html = sanitizeHTMLContent(htmlString);
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent;
};

export const truncateText = (txt = "", limit: number) => {
  if (txt?.length > limit) {
    return `${txt.slice(0, limit)}...`;
  }
  return txt;
};
