import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useMemo, useRef } from "react";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";

function useStableStringArray(values: string[]) {
  const signature = values.join("\u001f");
  const cacheRef = useRef<{ signature: string; values: string[] }>();

  if (!cacheRef.current || cacheRef.current.signature !== signature) {
    cacheRef.current = { signature, values };
  }

  return cacheRef.current.values;
}

type FormikChangesListenerProps = {
  children: React.ReactNode;
  filterFields: string[];
  paramsToReset?: string[];
  defaultFieldValues?: Record<string, string>;
  paramPrefix?: string;
};

function FormikChangesListener({
  children,
  filterFields,
  paramsToReset = [],
  defaultFieldValues = {},
  paramPrefix
}: FormikChangesListenerProps) {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | undefined>>();
  const [searchParams, setSearchParams] = usePrefixedSearchParams(
    paramPrefix,
    false,
    defaultFieldValues
  );
  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Sync form values to URL params
  useEffect(() => {
    setSearchParams((currentParams) => {
      let changed = false;
      const nextParams = new URLSearchParams(currentParams);

      filterFields.forEach((field) => {
        const value = values[field];
        const currentValue = nextParams.get(field);
        if (value && value.toLowerCase() !== "all") {
          if (currentValue !== value) {
            nextParams.set(field, value);
            changed = true;
          }
        } else if (currentValue !== null) {
          nextParams.delete(field);
          changed = true;
        }
      });

      paramsToReset.forEach((param) => {
        if (nextParams.has(param)) {
          nextParams.delete(param);
          changed = true;
        }
      });

      if (!changed) {
        return currentParams;
      }

      return nextParams;
    });
  }, [filterFields, paramsToReset, setSearchParams, values]);

  // Sync URL params to form values
  useEffect(() => {
    filterFields.forEach((field) => {
      const value =
        searchParams.get(field) ?? defaultFieldValues[field] ?? undefined;
      if (valuesRef.current[field] !== value) {
        setFieldValue(field, value, false);
      }
    });
  }, [defaultFieldValues, filterFields, searchParams, setFieldValue]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

type FilterFormProps = {
  children: React.ReactNode;
  paramsToReset: string[];
  filterFields: string[];
  /**
   * An object that maps filter fields to alternative query param keys. For
   * instance, if the filter is configTypes, and it's null, we can use
   * configType when available in the changes view
   */
  defaultFieldValues?: Record<string, string>;
  paramPrefix?: string;
};

/**
 *
 * FormikFilterForm
 *
 * A container for filter forms that uses Formik for state management. Formik is
 * also responsible for syncing the form state with the URL query params.
 *
 */
export default function FormikFilterForm({
  children,
  paramsToReset,
  filterFields,
  defaultFieldValues,
  paramPrefix
}: FilterFormProps) {
  const [searchParams] = usePrefixedSearchParams(paramPrefix, false);
  const stableFilterFields = useStableStringArray(filterFields);
  const stableParamsToReset = useStableStringArray(paramsToReset);

  const initialValues = useMemo(
    () =>
      stableFilterFields.reduce(
        (acc, field) => {
          const alternativeValue = defaultFieldValues?.[field] ?? undefined;
          acc[field] = searchParams.get(field) ?? alternativeValue ?? undefined;
          return acc;
        },
        {} as Record<string, string | undefined>
      ),
    [defaultFieldValues, searchParams, stableFilterFields]
  );

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ handleSubmit }) => (
        <FormikChangesListener
          filterFields={stableFilterFields}
          paramsToReset={stableParamsToReset}
          defaultFieldValues={defaultFieldValues}
          paramPrefix={paramPrefix}
        >
          <Form onSubmit={handleSubmit}>{children}</Form>
        </FormikChangesListener>
      )}
    </Formik>
  );
}
