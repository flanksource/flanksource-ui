import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { usePrefixedSearchParams } from "../../../../hooks/usePrefixedSearchParams";

type ViewTableFilterFormProps = {
  children: React.ReactNode;
  filterFields: string[];
  defaultFieldValues?: Record<string, string>;
  tablePrefix: string;
};

function ViewTableFilterListener({
  children,
  filterFields,
  defaultFieldValues = {},
  tablePrefix
}: ViewTableFilterFormProps): React.ReactElement {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | undefined>>();
  const [tableParams, setTableParams] = usePrefixedSearchParams(tablePrefix);

  useEffect(() => {
    setTableParams(() => {
      const newParams = new URLSearchParams();

      filterFields.forEach((field) => {
        const value = values[field];
        if (value && value.toLowerCase() !== "all") {
          newParams.set(field, value);
        }
      });

      // Note: paramsToReset is handled by the prefixed hook
      return newParams;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, setFieldValue, setTableParams]);

  // Reset form values when table filter params change
  useEffect(() => {
    filterFields.forEach((field) => {
      const value = tableParams.get(field) || defaultFieldValues[field];
      setFieldValue(field, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableParams.toString(), filterFields, setFieldValue]);

  return children as React.ReactElement;
}

/**
 * Table-specific filter form that ignores view_ prefixed URL parameters.
 * This prevents view-level filters from interfering with table column filters.
 */
export default function ViewTableFilterForm({
  children,
  filterFields,
  defaultFieldValues = {},
  tablePrefix
}: ViewTableFilterFormProps) {
  const [tableParams] = usePrefixedSearchParams(tablePrefix);

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    filterFields.forEach((field) => {
      values[field] = tableParams.get(field) || defaultFieldValues[field] || "";
    });
    return values;
  }, [tableParams, filterFields, defaultFieldValues]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        // Form submission is handled by the listener
      }}
      enableReinitialize
    >
      <Form>
        <ViewTableFilterListener
          filterFields={filterFields}
          defaultFieldValues={defaultFieldValues}
          tablePrefix={tablePrefix}
        >
          {children}
        </ViewTableFilterListener>
      </Form>
    </Formik>
  );
}
