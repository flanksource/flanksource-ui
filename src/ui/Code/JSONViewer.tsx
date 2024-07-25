import Highlight, { Language, defaultProps } from "prism-react-renderer";
import { ComponentProps, useMemo } from "react";
import { GoCopy } from "react-icons/go";
import { parse, stringify } from "yaml";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Button } from "../Buttons/Button";
import theme from "./JSONViewerTheme";

type RenderProps = Parameters<
  ComponentProps<typeof Highlight>["children"]
>[number];

type JSONViewerLineProps = {
  getTokenProps: RenderProps["getTokenProps"];
  onClick?: (idx: number) => void;
  showLineNo?: boolean;
  idx: number;
  line: RenderProps["tokens"][number];
} & React.HTMLAttributes<HTMLDivElement>;

function JSONViewerLine({
  getTokenProps,
  onClick = () => {},
  showLineNo = false,
  idx,
  line,
  ...props
}: JSONViewerLineProps) {
  const onSelect = () => onClick(idx);
  return (
    <div
      {...props}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyUp={onSelect}
    >
      {showLineNo && (
        <span className="table-cell select-none pr-3 text-xs text-gray-300">
          {idx + 1}
        </span>
      )}
      <span className="table-cell text-wrap break-all">
        {line.map((token, key) => (
          // key is in the getTokenProps responses. Disabling eslint to skip
          // check for explicit keys.
          // eslint-disable-next-line react/jsx-key
          <span {...getTokenProps({ token, key })} />
        ))}
      </span>
    </div>
  );
}

type JSONViewerProps = {
  code: string;
  format: Language;
  showLineNo?: boolean;
  onClick?: (idx: any) => void;
  selections?: Record<string, boolean>;
  /**
   *
   * Convert the content to yaml format
   *
   **/
  convertToYaml?: boolean;
  hideCopyButton?: boolean;
};

export function JSONViewer({
  code,
  format,
  showLineNo,
  selections,
  onClick = () => {},
  convertToYaml = false,
  hideCopyButton = false
}: JSONViewerProps) {
  // convert JSON object to YAML string
  const codeForHighlight = useMemo(() => {
    if (format !== "json" && format !== "yaml") {
      return code;
    }
    if (!code) {
      return "";
    }
    if (convertToYaml) {
      try {
        return stringify(parse(code));
      } catch (e) {
        console.error(e);
        return code;
      }
    }
    return code;
  }, [code, convertToYaml, format]);

  const copyFn = useCopyToClipboard();

  const formatDerived = useMemo(() => {
    if (format !== "json") {
      return format;
    }
    if (convertToYaml) {
      return "yaml";
    }
    return format;
  }, [convertToYaml, format]);

  return (
    <div className="relative flex w-full flex-col p-2">
      <Highlight
        {...defaultProps}
        code={codeForHighlight}
        theme={theme}
        language={formatDerived}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} text-sm`} style={style}>
            {tokens.map((line, i) => {
              const { style, ...props } = getLineProps({ line, key: i });
              return (
                <JSONViewerLine
                  {...props}
                  key={props.key}
                  style={{
                    ...style,
                    display: showLineNo ? "table-row" : "block",
                    backgroundColor:
                      selections && selections[i] ? "#cfe3ff" : ""
                  }}
                  onClick={onClick}
                  getTokenProps={getTokenProps}
                  showLineNo={showLineNo}
                  idx={i}
                  line={line}
                />
              );
            })}
          </pre>
        )}
      </Highlight>
      {!hideCopyButton && (
        <Button
          icon={<GoCopy />}
          title="Copy to clipboard"
          className={
            "absolute right-4 z-[99999999999999999] bg-white text-black"
          }
          onClick={async () => {
            await copyFn(codeForHighlight);
          }}
        />
      )}
    </div>
  );
}
