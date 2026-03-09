import { Form, Formik, useFormikContext } from "formik";
import { useEffect } from "react";
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
  const [tableParams, setTableParams] = usePrefixedSearchParams(
    tablePrefix,
    false
  );

  useEffect(() => {
    setTableParams((current) => {
      const newParams = new URLSearchParams(current);
      let filtersChanged = false;

      filterFields.forEach((field) => {
        const rawValue = values[field];
        const value =
          rawValue && rawValue.toLowerCase() !== "all" ? rawValue : undefined;
        const currentValue = current.get(field) ?? undefined;

        if (value) {
          if (currentValue !== value) {
            newParams.set(field, value);
            filtersChanged = true;
          }
          return;
        }

        if (currentValue != null) {
          newParams.delete(field);
          filtersChanged = true;
        }
      });

      if (filtersChanged) {
        newParams.delete("pageIndex");
      }

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
  return (
    <Formik
      initialValues={{}}
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
