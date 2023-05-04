import { useField, useFormikContext } from "formik";
import { isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import YAML from "yaml";

const CodeEditor = dynamic(
  () => import("../../CodeEditor").then((m) => m.CodeEditor),
  {
    ssr: false
  }
);

type FormikCodeEditorProps = {
  format?: string;
  fieldName: string;
  className?: string;
  schemaFilePrefix?: "component" | "canary" | "system" | "scrape_config";
};

export function FormikCodeEditor({
  format = "yaml",
  fieldName,
  className = "h-[min(1000px,calc(90vh))]",
  schemaFilePrefix
}: FormikCodeEditorProps) {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [field] = useField(fieldName);

  const { value: values } = field;

  // we want to debounce the code editor value so that we can avoid the code
  // editor jumping around when the user is typing
  const [codeEditorValue, setCodeEditorValue] = useState<string | undefined>();

  const debouncedValues = useDebounce(codeEditorValue, 300);

  useEffect(() => {
    if (debouncedValues) {
      try {
        if (format === "yaml" || format === "json") {
          setFieldValue(
            fieldName,
            format === "yaml"
              ? YAML.parse(debouncedValues)
              : JSON.parse(debouncedValues)
          );
        } else {
          setFieldValue(fieldName, debouncedValues);
        }
      } catch (e) {
        // do nothing, we don't want to set the values if the user is typing
      }
    }
  }, [debouncedValues, fieldName, format, setFieldValue]);

  // we want to calculate the value of the code editor one way only, when the
  // component is first rendered. We don't want to re-calculate the value of the
  // code editor when the user is typing, as this will cause the code editor to
  // jump around, and the user's cursor to jump around.
  const value = useMemo(() => {
    if (!isEmpty(values)) {
      if (format === "yaml" || format === "json") {
        return format === "yaml"
          ? YAML.stringify(values, {
              sortMapEntries: true
            })
          : JSON.stringify(values);
      } else {
        return values;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <CodeEditor
        onChange={(v) => {
          if (v) {
            setCodeEditorValue(v);
          } else {
            // if the value is empty, we want to reset the form
            setFieldValue(fieldName, {});
          }
        }}
        value={value}
        language={format}
        schemaFilePrefix={schemaFilePrefix}
      />
    </div>
  );
}
