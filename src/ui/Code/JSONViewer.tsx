import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import githubLight from "monaco-themes/themes/GitHub Light.json";
import { useEffect, useMemo, useRef } from "react";
import { GoCopy } from "react-icons/go";
import { parse, stringify } from "yaml";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { Button } from "../Buttons/Button";

type JSONViewerProps = {
  code: string;
  format: string;
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
  showLineNo = true,
  selections,
  onClick = () => {},
  convertToYaml = false,
  hideCopyButton = false
}: JSONViewerProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Cleanup resize observer on unmount
  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  // convert JSON object to YAML string
  const codeForDisplay = useMemo(() => {
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

  const language = useMemo(() => {
    if (format !== "json") {
      return format;
    }
    if (convertToYaml) {
      return "yaml";
    }
    return format;
  }, [convertToYaml, format]);

  const copyFn = useCopyToClipboard();

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monacoInstance: Monaco
  ) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;

    // Define GitHub Light theme
    monacoInstance.editor.defineTheme("githubLight", githubLight as any);
    monacoInstance.editor.setTheme("githubLight");

    // Apply initial selections
    if (selections) {
      const decorations: editor.IModelDeltaDecoration[] = [];
      Object.keys(selections).forEach((lineIdx) => {
        if (selections[lineIdx]) {
          const lineNumber = parseInt(lineIdx, 10) + 1;
          decorations.push({
            range: new monacoInstance.Range(lineNumber, 1, lineNumber, 1),
            options: {
              isWholeLine: true,
              className: "bg-blue-100"
            }
          });
        }
      });
      editorInstance.createDecorationsCollection(decorations);
    }

    // Handle line clicks for selection
    editorInstance.onMouseDown((e) => {
      if (e.target.position) {
        const lineNumber = e.target.position.lineNumber;
        onClick(lineNumber - 1); // Convert to 0-indexed
      }
    });

    // Set up resize observer now that editor is ready
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        editorInstance.layout();
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Force layout after mount with multiple delays to ensure container is sized
    setTimeout(() => editorInstance.layout(), 0);
    setTimeout(() => editorInstance.layout(), 50);
    setTimeout(() => editorInstance.layout(), 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-0 w-full flex-1 flex-col p-2"
    >
      <Editor
        value={codeForDisplay}
        language={language}
        height="100%"
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: showLineNo ? "on" : "off",
          folding: true,
          foldingStrategy: "indentation",
          foldingHighlight: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto"
          },
          wordWrap: "on",
          lineHeight: 19,
          fontSize: 14,
          padding: { top: 8, bottom: 8 },
          domReadOnly: true,
          contextmenu: false
        }}
      />
      {!hideCopyButton && (
        <Button
          icon={<GoCopy />}
          title="Copy to clipboard"
          className="absolute right-4 top-4 z-10 bg-white text-black"
          onClick={async () => {
            await copyFn(codeForDisplay);
          }}
        />
      )}
    </div>
  );
}
