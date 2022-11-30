import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";

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

          // eslint-disable-next-line react/jsx-key
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
};

export function JSONViewer({
  code,
  format,
  showLineNo,
  selections,
  onClick = () => {}
}: JSONViewerProps) {
  return (
    <Highlight {...defaultProps} code={code} theme={vsLight} language={format}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} text-sm`} style={style}>
          {tokens.map((line, i) => {
            const { style, ...props } = getLineProps({ line, key: i });
            /* eslint-disable react/jsx-key */
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
