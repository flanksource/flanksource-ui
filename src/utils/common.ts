import { parse, stringify } from "qs";
import DOMPurify from "dompurify";
import dayjs from "dayjs";

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

export function searchParamsToObj(searchParams: URLSearchParams) {
  return parse(searchParams.toString());
}

export function toQueryString(paramsObject: Record<string, string>) {
  return stringify(paramsObject);
}

export const sanitizeHTMLContent = (htmlString: string) => {
  return DOMPurify.sanitize(htmlString);
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

export function hasStringMatch(pattern: string, text?: string) {
  if (!text) {
    return false;
  }
  return text.indexOf(pattern) >= 0;
}

export const getStartValue = (start: string) => {
  if (!start.includes("mo")) {
    return start;
  }

  return dayjs()
    .subtract(+(start.match(/\d/g)?.[0] ?? "1"), "month")
    .toISOString();
};

export const delayedPromise = <T>(val: T, time: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, time);
  });
};

export const stringSortHelper = (val1: string, val2: string) => {
  if (val1 > val2) {
    return 1;
  }
  if (val1 < val2) {
    return -1;
  }
  return 0;
};
