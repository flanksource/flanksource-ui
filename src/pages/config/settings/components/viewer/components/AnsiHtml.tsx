import type { CSSProperties } from "react";

const ANSI_STYLES: Record<string, CSSProperties> = {
  "30": { color: "#1e1e1e" },
  "31": { color: "#cd3131" },
  "32": { color: "#0dbc79" },
  "33": { color: "#e5e510" },
  "34": { color: "#2472c8" },
  "35": { color: "#bc3fbc" },
  "36": { color: "#11a8cd" },
  "37": { color: "#e5e5e5" },
  "90": { color: "#666" },
  "91": { color: "#f14c4c" },
  "92": { color: "#23d18b" },
  "93": { color: "#f5f543" },
  "94": { color: "#3b8eea" },
  "95": { color: "#d670d6" },
  "96": { color: "#29b8db" },
  "97": { color: "#fff" },
  "1": { fontWeight: "bold" },
  "2": { opacity: 0.7 },
  "3": { fontStyle: "italic" },
  "4": { textDecoration: "underline" }
};

interface Span {
  text: string;
  style?: CSSProperties;
}

function parseAnsi(raw: string): Span[] {
  const spans: Span[] = [];
  // eslint-disable-next-line no-control-regex
  const re = new RegExp("\\u001b\\[([0-9;]*)m", "g");
  let last = 0;
  let style: CSSProperties = {};
  let match: RegExpExecArray | null;

  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      spans.push({
        text: raw.slice(last, match.index),
        style: Object.keys(style).length ? { ...style } : undefined
      });
    }

    const codes =
      match[1] === "" ? ["0"] : match[1].split(";").map((code) => code || "0");
    for (const code of codes) {
      if (code === "0") {
        style = {};
      } else if (code === "22") {
        const { fontWeight, opacity, ...rest } = style;
        style = rest;
      } else if (code === "23") {
        const { fontStyle, ...rest } = style;
        style = rest;
      } else if (code === "24") {
        const { textDecoration, ...rest } = style;
        style = rest;
      } else if (code === "39") {
        const { color, ...rest } = style;
        style = rest;
      } else if (ANSI_STYLES[code]) {
        style = { ...style, ...ANSI_STYLES[code] };
      }
    }

    last = match.index + match[0].length;
  }

  if (last < raw.length) {
    spans.push({
      text: raw.slice(last),
      style: Object.keys(style).length ? style : undefined
    });
  }

  return spans;
}

interface Props {
  text: string;
  className?: string;
}

export function AnsiHtml({ text, className }: Props) {
  const spans = parseAnsi(text);
  return (
    <pre className={className}>
      {spans.map((s, i) =>
        s.style ? (
          <span key={i} style={s.style}>
            {s.text}
          </span>
        ) : (
          s.text
        )
      )}
    </pre>
  );
}
