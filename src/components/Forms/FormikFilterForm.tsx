import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type FormikChangesListenerProps = {
  children: React.ReactNode;
  filterFields: string[];
  paramsToReset?: string[];
  defaultFieldValues?: Record<string, string>;
};

function FormikChangesListener({
  children,
  filterFields,
  paramsToReset = [],
  defaultFieldValues = {}
}: FormikChangesListenerProps) {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | undefined>>();
  const [searchParams, setSearchParams] = useSearchParams({
    ...defaultFieldValues
  });

  useEffect(() => {
    filterFields.forEach((field) => {
      const value = values[field];
      if (value && value.toLowerCase() !== "all") {
        searchParams.set(field, value);
      } else {
        searchParams.delete(field);
      }
    });
    paramsToReset.forEach((param) => searchParams.delete(param));
    setSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, setFieldValue]);

  // reset form values, if the query params change
  useEffect(() => {
    filterFields.forEach((field) => {
      const value = searchParams.get(field);
      setFieldValue(field, value);
    }, []);
  }, [filterFields, searchParams, setFieldValue]);

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
  defaultFieldValues
}: FilterFormProps) {
  const [searchParams] = useSearchParams();

  const initialValues = useMemo(
    () =>
      filterFields.reduce(
        (acc, field) => {
          const alternativeValue = defaultFieldValues?.[field] ?? undefined;
          acc[field] = searchParams.get(field) ?? alternativeValue ?? undefined;
          return acc;
        },
        {} as Record<string, string | undefined>
      ),
    [defaultFieldValues, filterFields, searchParams]
  );

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ handleSubmit }) => (
        <FormikChangesListener
          filterFields={filterFields}
          paramsToReset={paramsToReset}
          defaultFieldValues={defaultFieldValues}
        >
          <Form onSubmit={handleSubmit}>{children}</Form>
        </FormikChangesListener>
      )}
    </Formik>
  );
}
