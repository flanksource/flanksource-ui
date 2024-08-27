import Hint, { HintPosition } from "@flanksource-ui/ui/FormControls/Hint";
import { useField, useFormikContext } from "formik";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import YAML from "yaml";

const CodeEditor = dynamic(
  () => import("@flanksource-ui/ui/Code/CodeEditor").then((m) => m.CodeEditor),
  {
    ssr: false
  }
);

type FormikCodeEditorProps = {
  format?: string;
  hint?: string;
  hintPosition?: HintPosition;
  fieldName: string;
  className?: string;
  lines?: number;
  height?: string;
  /**
   * @deprecated use jsonSchemaUrl instead
   */
  schemaFileName?: string;
  /**
   *
   * The url to the json schema file for the code editor
   *
   */
  jsonSchemaUrl?: string;
  labelClassName?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  /**
   * If true, the value will be saved as a string, and not parsed as yaml or
   * json before updating the formik field value
   */
  saveAsString?: boolean;
  enableSpecUnwrap?: boolean;
};

export function FormikCodeEditor({
  format = "yaml",
  fieldName,
  hint,
  hintPosition,
  schemaFileName,
  jsonSchemaUrl,
  height,
  lines,
  label,
  labelClassName,
  disabled,
  className = "flex flex-col h-[min(1000px,calc(90vh))]",
  required = false,
  saveAsString = false,
  enableSpecUnwrap = false
}: FormikCodeEditorProps) {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [field] = useField({
    name: fieldName,
    type: "text",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  const { value: specFormValue } = field;

  const value = useMemo(() => {
    if (typeof specFormValue === "string") {
      return specFormValue;
    }
    // In case the value is not a string, we need to convert it to a string, as
    // the code editor only accepts strings.
    if (format === "yaml") {
      return YAML.stringify(specFormValue);
    }
    if (format === "json") {
      return JSON.stringify(specFormValue, null, 2);
    }
    return "";
  }, [format, specFormValue]);

  const onChange = useCallback(
    (v?: string) => {
      if (v) {
        try {
          // The code editor will always return a string, so we need to parse
          // it before setting the formik field value, unless saveAsString is
          // true in which case we just set the value as a string.
          if ((format === "yaml" || format === "json") && !saveAsString) {
            if (v) {
              setFieldValue(
                fieldName,
                format === "yaml" ? YAML.parse(v) : JSON.parse(v)
              );
            } else {
              setFieldValue(fieldName, undefined);
            }
          } else {
            setFieldValue(fieldName, v);
          }
        } catch (e) {
          // do nothing, we don't want to set the values if the user is typing
        }
      } else {
        setFieldValue(fieldName, undefined);
      }
    },
    [fieldName, format, saveAsString, setFieldValue]
  );

  return (
    <div className={className}>
      {label && (
        <div className="flex flex-col">
          <label
            className={`form-label flex flex-row items-center space-x-2 ${labelClassName}`}
          >
            {label}
            {hint && hintPosition === "tooltip" && (
              <Hint id={fieldName} hint={hint} type={hintPosition} />
            )}
          </label>
          {hint && hintPosition !== "tooltip" && (
            <Hint id={fieldName} hint={hint} type={hintPosition} />
          )}
        </div>
      )}
      <CodeEditor
        onChange={onChange}
        value={value}
        lines={lines}
        height={height}
        language={format}
        schemaFileName={schemaFileName}
        jsonSchemaUrl={jsonSchemaUrl}
        readOnly={disabled}
        enableSpecUnwrap={enableSpecUnwrap}
      />
    </div>
  );
}
