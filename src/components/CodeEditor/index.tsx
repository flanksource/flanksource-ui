import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { setDiagnosticsOptions } from "monaco-yaml";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import YAML from "yaml";

loader.config({ monaco });

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case "editorWorkerService":
        return new Worker(
          new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url)
        );
      case "css":
      case "less":
      case "scss":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/css/css.worker",
            import.meta.url
          )
        );
      case "handlebars":
      case "html":
      case "razor":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/html/html.worker",
            import.meta.url
          )
        );
      case "json":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker",
            import.meta.url
          )
        );
      case "javascript":
      case "typescript":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/typescript/ts.worker",
            import.meta.url
          )
        );
      case "yaml":
        return new Worker(new URL("monaco-yaml/yaml.worker", import.meta.url));
      default:
        throw new Error(`Unknown label ${label}`);
    }
  }
};

interface Props {
  value?: string;
  readOnly?: boolean;
  onChange: (value: string | undefined, viewUpdate: unknown) => void;
  schemaFilePrefix?: "component" | "canary" | "system" | "scrape_config";
  language?: string;
  extractYamlSpecFieldOnPaste?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  schemaFilePrefix,
  language,
  extractYamlSpecFieldOnPaste = false
}: Props) {
  const editorWrapper = useRef<HTMLDivElement>(null);

  const monaco = useMonaco();

  useEffect(() => {
    if (!extractYamlSpecFieldOnPaste) {
      return;
    }
    // default paste event handler type is just Event, which is inaccurate, hence we
    // are overriding it here, so we can use ClipboardEvent, which is more
    // accurate and allows us to access clipboardData safely
    // @ts-expect-error
    window.addEventListener("paste", (e: ClipboardEvent) => {
      if (editorWrapper.current?.id === document.activeElement?.id && monaco) {
        e.preventDefault();
        const text = e.clipboardData?.getData("text/plain");
        if (text) {
          if (language === "yaml") {
            const yaml = YAML.parse(text);
            if (yaml.spec) {
              const model = monaco.editor
                .getModels()
                // at the moment, we only have one model that is yaml, but
                // this may change in the future and we should find a more
                // robust way of identifying the model and can cause spec being
                // pasted in the wrong editor
                .find(
                  (m) => m.getValue() === text && m.getLanguageId() === "yaml"
                );
              model?.setValue(YAML.stringify(yaml.spec));
            }
          }
        }
      }
    });

    return () => {
      window.removeEventListener("paste", () => {});
    };
  }, [language, extractYamlSpecFieldOnPaste, monaco]);

  useEffect(() => {
    if (!schemaFilePrefix || language !== "yaml") {
      return;
    }
    const schemaFileName = `${schemaFilePrefix}.spec.schema.json`;
    setDiagnosticsOptions({
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      schemas: [
        {
          // Our schema file will be loaded from the server
          uri: `/api/schemas/${schemaFileName}`,
          // Files to associate with our model, in this case everything
          fileMatch: ["*"]
        }
      ]
    });
  }, [language, schemaFilePrefix]);

  return (
    <Editor
      className="border shadow py-2"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={onChange}
      width="100%"
      options={{
        renderLineHighlight: "none",
        readOnly,
        minimap: { enabled: false },
        formatOnPaste: true,
        formatOnType: true
      }}
      wrapperProps={{
        ref: editorWrapper
      }}
    />
  );
}
