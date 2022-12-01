import { useMemo } from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";
import { parse, stringify } from "yaml";

const Line = ({ getTokenProps, onClick, showLineNo, idx, line, ...props }) => {
  const onSelect = () => onClick && onClick(idx);
  return (
    <div
      {...props}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyUp={onSelect}
    >
      {showLineNo && (
        <span
          className="text-gray-400 text-xs px-1"
          style={{ display: "table-cell" }}
        >
          {idx + 1}
        </span>
      )}
      <span style={{ display: "table-cell" }}>
        {line.map((token, key) => (
          // key is in the getTokenProps responses. Disabling eslint to skip
          // check for explicit keys.
          <span {...getTokenProps({ token, key })} />
        ))}
      </span>
    </div>
  );
};

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
};

export function JSONViewer({
  code,
  format,
  showLineNo,
  selections,
  onClick = () => {},
  convertToYaml = false
}: JSONViewerProps) {
  // convert JSON object to YAML string
  const codeForHighlight = useMemo(() => {
    if (!code) {
      return "";
    }
    if (convertToYaml) {
      return stringify(parse(code));
    }
    return code;
  }, [code, convertToYaml]);

  return (
    <Highlight
      {...defaultProps}
      code={codeForHighlight}
      theme={vsLight}
      language={convertToYaml ? "yaml" : format}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} text-sm`} style={style}>
          {tokens.map((line, i) => {
            const { style, ...props } = getLineProps({ line, key: i });
            return (
              <Line
                {...props}
                style={{
                  ...style,
                  display: showLineNo ? "table-row" : "block",
                  backgroundColor: selections && selections[i] ? "#cfe3ff" : ""
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
  );
}
