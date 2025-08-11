import clsx from "clsx";
import Highlight, {
  Language,
  PrismTheme,
  defaultProps
} from "prism-react-renderer";
import { FaCopy } from "react-icons/fa";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Button } from "../Buttons/Button";
import { lightTheme } from "./JSONViewerTheme";

type Props = {
  code: string;
  codeBlockClassName?: string;
  className?: string;
  language?: Language;
  theme?: PrismTheme;
  showLineNumbers?: boolean;
};

export default function CodeBlock({
  code,
  codeBlockClassName = "whitespace-pre-wrap break-all",
  className = "flex flex-col flex-1 text-sm text-left gap-2 bg-gray-800 text-white rounded-lg p-4 pl-6",
  language,
  theme = lightTheme,
  showLineNumbers = false
}: Props) {
  const copyFn = useCopyToClipboard();

  // If no language is specified, use the original simple code block
  if (!language) {
    return (
      <div className="relative flex w-full flex-row gap-4">
        <code className={className}>
          <pre className={codeBlockClassName}>{code}</pre>
        </code>
        <Button
          icon={<FaCopy />}
          title="Copy to clipboard"
          className={clsx(
            "absolute right-4 top-4 whitespace-pre-line bg-white",
            "text-black"
          )}
          onClick={() => {
            copyFn(`${code}`);
          }}
        />
      </div>
    );
  }

  // Use syntax highlighting when language is specified
  return (
    <div className="relative flex w-full flex-col">
      <Highlight
        {...defaultProps}
        code={code}
        theme={theme}
        language={language}
      >
        {({
          className: highlightClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps
        }) => (
          <pre
            className={clsx(highlightClassName, "rounded-lg p-4 text-sm")}
            style={style}
          >
            {tokens.map((line, i) => {
              const { style: lineStyle, ...lineProps } = getLineProps({
                line,
                key: i
              });
              return (
                <div
                  {...lineProps}
                  key={lineProps.key}
                  style={{
                    ...lineStyle,
                    display: showLineNumbers ? "table-row" : "block"
                  }}
                >
                  {showLineNumbers && (
                    <span className="table-cell select-none pr-3 text-xs opacity-50">
                      {i + 1}
                    </span>
                  )}
                  <span className={showLineNumbers ? "table-cell" : "block"}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
      <Button
        icon={<FaCopy />}
        title="Copy to clipboard"
        className={clsx(
          "absolute right-4 top-4 whitespace-pre-line bg-white",
          "z-10 text-black"
        )}
        onClick={() => {
          copyFn(code);
        }}
      />
    </div>
  );
}
