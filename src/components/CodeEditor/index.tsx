import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  readOnly?: boolean;
  onChange: (value: unknown, viewUpdate: unknown) => void;
}

export function CodeEditor({ value, onChange, readOnly = false }: Props) {
  return (
    <Editor
      defaultLanguage="json"
      value={value}
      onChange={onChange}
      height="200px"
      options={{
        readOnly,
        minimap: { enabled: false }
      }}
    />
  );
}
