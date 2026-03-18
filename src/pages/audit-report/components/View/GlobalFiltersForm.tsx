import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";
import { ViewVariable } from "../../types";

type GlobalFiltersFormProps = {
  children: React.ReactNode;
  variables: ViewVariable[];
  globalVarPrefix: string;
  currentVariables?: Record<string, string>;
};

const EMPTY_VARIABLES: Record<string, string> = {};

function GlobalFiltersListener({
  children,
  variables,
  globalVarPrefix
}: Omit<GlobalFiltersFormProps, "currentVariables">): React.ReactElement {
  const { values } = useFormikContext<Record<string, string | undefined>>();
  const [, setGlobalParams] = usePrefixedSearchParams(globalVarPrefix);

  // Sync form → URL whenever values change.
  // The reverse direction (URL → form) is handled by initialValues in the
  // parent so that we avoid an Effect chain (write URL → read URL → set field
  // → write URL → …).
  useEffect(() => {
    setGlobalParams(() => {
      const newParams = new URLSearchParams();

      variables.forEach((variable) => {
        const value = values[variable.key];
        if (value) {
          newParams.set(variable.key, value);
        }
      });

      return newParams;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, setGlobalParams]);

  return children as React.ReactElement;
}

/**
 * Global filters form that manages view-level filter parameters.
 * This handles synchronization between Formik form state and URL parameters
 * for global filters that affect the entire view (panels + table).
 */
export default function GlobalFiltersForm({
  children,
  variables,
  globalVarPrefix,
  currentVariables
}: GlobalFiltersFormProps) {
  const [globalParams] = usePrefixedSearchParams(globalVarPrefix);

  // Compute initialValues once from URL params + variable defaults so that
  // the Formik form starts with the correct values without needing a
  // "read URL → setFieldValue" Effect.
  const initialValues = useMemo<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    variables.forEach((variable) => {
      const urlValue = globalParams.get(variable.key);
      const currentValue = currentVariables?.[variable.key];
      const optionItems = variable.optionItems ?? [];
      const defaultValue =
        variable.default ??
        (optionItems.length > 0
          ? optionItems[0].value
          : variable.options.length > 0
            ? variable.options[0]
            : "");

      const valueToUse = urlValue || currentValue || defaultValue;
      if (valueToUse) values[variable.key] = valueToUse;
    });
    return values;
    // Intentionally omit `globalParams` so we only re-initialise when the
    // variable definition or external current-variable overrides change, not
    // on every URL write triggered by the form→URL Effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, currentVariables]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        // Form submission is handled by the listener
      }}
      enableReinitialize
    >
      <Form>
        <GlobalFiltersListener
          variables={variables}
          globalVarPrefix={globalVarPrefix}
        >
          {children}
        </GlobalFiltersListener>
      </Form>
    </Formik>
  );
}
