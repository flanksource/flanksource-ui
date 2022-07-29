import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";

export function CodeEditor() {
  const onChange = useCallback((value: unknown, viewUpdate: unknown) => {
    console.log("value:", value);
  }, []);
  return (
    <CodeMirror
      value={`{ some: "value" }`}
      theme={githubLight}
      height="200px"
      extensions={[json()]}
      onChange={onChange}
    />
  );
}
