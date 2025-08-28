import { Form, Formik, useFormikContext } from "formik";
import { useEffect } from "react";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";
import { ViewVariable } from "../../types";

type GlobalFiltersFormProps = {
  children: React.ReactNode;
  variables: ViewVariable[];
  globalVarPrefix: string;
  currentVariables?: Record<string, string>;
};

function GlobalFiltersListener({
  children,
  variables,
  globalVarPrefix,
  currentVariables = {}
}: GlobalFiltersFormProps): React.ReactElement {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | undefined>>();
  const [globalParams, setGlobalParams] =
    usePrefixedSearchParams(globalVarPrefix);

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

  // Initialize form values when variables load or URL params change
  useEffect(() => {
    variables.forEach((variable) => {
      const urlValue = globalParams.get(variable.key);
      const currentValue = currentVariables[variable.key];
      const defaultValue =
        variable.default ||
        (variable.options.length > 0 ? variable.options[0] : "");

      const valueToUse = urlValue || currentValue || defaultValue;
      if (valueToUse) {
        setFieldValue(variable.key, valueToUse);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalParams.toString(), variables, currentVariables, setFieldValue]);

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
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        // Form submission is handled by the listener
      }}
      enableReinitialize
    >
      <Form>
        <GlobalFiltersListener
          variables={variables}
          globalVarPrefix={globalVarPrefix}
          currentVariables={currentVariables}
        >
          {children}
        </GlobalFiltersListener>
      </Form>
    </Formik>
  );
}
