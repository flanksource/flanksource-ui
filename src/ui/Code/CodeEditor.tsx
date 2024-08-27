import Editor, { loader, useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import githubLight from "monaco-themes/themes/GitHub Light.json";
import { configureMonacoYaml } from "monaco-yaml";
import { useCallback, useEffect, useMemo, useState } from "react";
import YAML from "yaml";
import { Button } from "../Buttons/Button";

function useSpecUnwrap(
  onChange: (value: string | undefined, viewUpdate: unknown) => void,
  value: string | undefined,
  language?: string
) {
  const canInlineSpec = useMemo(() => {
    if (!value) {
      return false;
    }
    if (language === "json") {
      try {
        const parsed = JSON.parse(value);
        return !!parsed.spec;
      } catch (e) {
        return false;
      }
    }
    if (language === "yaml") {
      try {
        const parsed = YAML.parse(value);
        return !!parsed.spec;
      } catch (e) {
        return false;
      }
    }
    return false;
  }, [language, value]);

  const unWrapSpec = useCallback(() => {
    if (!value) {
      return;
    }
    if (language === "json") {
      try {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed.spec, null, 2), {});
      } catch (e) {
        console.error(e);
      }
    }
    if (language === "yaml") {
      try {
        const parsed = YAML.parse(value);
        onChange(YAML.stringify(parsed.spec, { indent: 2 }), {});
      } catch (e) {
        console.error(e);
      }
    }
  }, [language, onChange, value]);

  return { unWrapSpec, canInlineSpec };
}

loader.config({ monaco });

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case "json":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker",
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
  lines?: number;
  height?: string;
  readOnly?: boolean;
  onChange: (value: string | undefined, viewUpdate: unknown) => void;
  /**
   * @deprecated use "jsonSchemaUrl" instead, will be removed in the future
   */
  schemaFileName?: string;
  jsonSchemaUrl?: string;
  language?: string;
  enableSpecUnwrap?: boolean;
}

export function CodeEditor({
  value,
  lines,
  height,
  onChange,
  readOnly = false,
  schemaFileName,
  jsonSchemaUrl,
  language,
  enableSpecUnwrap = false
}: Props) {
  const monaco = useMonaco();
  const [forceValue, setForceValue] = useState(false);

  // if we have a schema file, we will use the monaco-yaml plugin to enable
  const schemaUrl =
    jsonSchemaUrl ??
    (schemaFileName ? `/api/schemas/${schemaFileName}` : undefined);

  useEffect(() => {
    if (!schemaUrl || language !== "yaml") {
      return;
    }

    if (!monaco) {
      return;
    }

    // Define a new theme that is based on the GitHub Light theme
    monaco.editor.defineTheme("githubLight", githubLight as any);

    const { dispose } = configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      schemas: [
        {
          // Our schema file will be loaded from the server
          uri: schemaUrl,
          // Files to associate with our model, in this case everything
          fileMatch: ["*"]
        }
      ]
    });

    return () => {
      // dispose of the monaco-yaml plugin
      if (monaco && dispose) {
        dispose();
      }
    };
  }, [jsonSchemaUrl, language, monaco, schemaUrl]);

  const onChangeValue = useCallback(
    (value: string | undefined) => {
      setForceValue(true);
      onChange(value, {});
    },
    [onChange]
  );

  const { unWrapSpec, canInlineSpec } = useSpecUnwrap(
    onChangeValue,
    value,
    language
  );

  const lineHeight = 15;
  if (lines) {
    height = `${lines * lineHeight + 20}px`;
  }

  return (
    <>
      {enableSpecUnwrap && canInlineSpec && (
        <div className="relative my-1 flex flex-row gap-2 pb-1" role="alert">
          <div className="text-red-600">
            Wrapping spec field detected, do you want to unwrap it?
          </div>
          <Button
            className="rounded border border-gray-500 bg-white px-1.5"
            size="none"
            onClick={unWrapSpec}
          >
            Yes
          </Button>
        </div>
      )}
      <Editor
        className="border py-2 shadow"
        defaultLanguage={language}
        language={language}
        // This is an uncontrolled component, we only set the initial value and
        // let the user type in the editor, we only update the value when the
        // user clicks the unwrap button.
        defaultValue={value}
        // We only want to update value after mount, under very specific
        // conditions such as the user clicking the unwrap button, otherwise we
        // treat the code editor as an uncontrolled component to avoid losing
        // the cursor position when the user types in the editor.
        value={forceValue ? value : undefined}
        onChange={(v) => {
          onChange(v, {});
          setForceValue(false);
        }}
        height={height}
        width="100%"
        options={{
          renderLineHighlight: "none",
          readOnly,
          minimap: { enabled: false },
          lineHeight: lineHeight,
          scrollBeyondLastLine: false
        }}
        {...{
          // high contrast theme for yaml and json
          ...((language === "yaml" || language === "json") && {
            theme: "githubLight"
          })
        }}
      />
    </>
  );
}
