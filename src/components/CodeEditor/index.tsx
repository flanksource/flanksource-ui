import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";

interface Props {
  value: string;
  readOnly?: boolean;
  onChange: (value: unknown, viewUpdate: unknown) => void;
}

export function CodeEditor({ value, onChange, readOnly = false }: Props) {
  return (
    <CodeMirror
      value={value}
      theme={githubLight}
      height="200px"
      extensions={[json()]}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}
