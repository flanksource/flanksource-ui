import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  readOnly?: boolean;
  onChange: (value: string | undefined, viewUpdate: unknown) => void;
}

export function CodeEditor({ value, onChange, readOnly = false }: Props) {
  return (
    <Editor
      className="border shadow py-2"
      defaultLanguage="json"
      value={value}
      onChange={onChange}
      height="200px"
      options={{
        renderLineHighlight: "none",
        readOnly,
        minimap: { enabled: false }
      }}
    />
  );
}
