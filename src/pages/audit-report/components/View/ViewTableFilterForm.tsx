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
  tablePrefix
}: Omit<
  ViewTableFilterFormProps,
  "defaultFieldValues"
>): React.ReactElement {
  const { values } = useFormikContext<Record<string, string | undefined>>();
  const [, setTableParams] = usePrefixedSearchParams(tablePrefix, false);

  // Sync form → URL whenever values change.
  // The reverse direction (URL → form) is handled by initialValues in the
  // parent so we avoid a write-URL → read-URL → setFieldValue → write-URL
  // Effect chain.
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
  }, [values, setTableParams]);

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
  const [tableParams] = usePrefixedSearchParams(tablePrefix, false);

  // Compute initialValues once from URL params + provided defaults so that
  // the Formik form starts populated without a "read URL → setFieldValue"
  // Effect.
  const initialValues = useMemo<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    filterFields.forEach((field) => {
      const value = tableParams.get(field) || defaultFieldValues[field];
      if (value) values[field] = value;
    });
    return values;
    // Intentionally omit `tableParams` so we only re-initialise when the
    // field list or default values change, not on every URL write triggered
    // by the form→URL Effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFields, defaultFieldValues]);

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
          tablePrefix={tablePrefix}
        >
          {children}
        </ViewTableFilterListener>
      </Form>
    </Formik>
  );
}
