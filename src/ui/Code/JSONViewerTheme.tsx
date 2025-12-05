import { PrismTheme } from "prism-react-renderer";

const lightTheme = {
  plain: {
    color: "##002b5c",
    backgroundColor: "#fffff"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6a737d",
        fontStyle: "italic"
      }
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ["string", "attr-value", "plain"],
      style: {
        color: "#032f62"
      }
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#393A34"
      }
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "property",
        "regex",
        "inserted"
      ],
      style: {
        color: "#032f62"
      }
    },
    {
      types: ["atrule", "keyword", "attr-name", "selector"],
      style: {
        color: "#0f5929"
      }
    },
    {
      types: ["function", "deleted", "tag"],
      style: {
        color: "#d73a49"
      }
    },
    {
      types: ["function-variable"],
      style: {
        color: "#6f42c1"
      }
    },
    {
      types: ["tag", "selector", "keyword"],
      style: {
        color: "#00009f"
      }
    }
  ]
} as PrismTheme;

const darkTheme = {
  plain: {
    color: "#e1e4e8",
    backgroundColor: "transparent"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#8b949e",
        fontStyle: "italic"
      }
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ["string", "attr-value"],
      style: {
        color: "#a5d6ff"
      }
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#e1e4e8"
      }
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "property",
        "regex",
        "inserted"
      ],
      style: {
        color: "#79c0ff"
      }
    },
    {
      types: ["atrule", "keyword", "attr-name", "selector"],
      style: {
        color: "#ff7b72"
      }
    },
    {
      types: ["function", "deleted", "tag"],
      style: {
        color: "#d2a8ff"
      }
    },
    {
      types: ["function-variable"],
      style: {
        color: "#d2a8ff"
      }
    },
    {
      types: ["tag", "selector", "keyword"],
      style: {
        color: "#ff7b72"
      }
    }
  ]
} as PrismTheme;

export { lightTheme, darkTheme };
