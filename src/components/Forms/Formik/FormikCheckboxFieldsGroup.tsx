import { useField, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import { useEffect } from "react";
import CheckboxCollapsibleGroup from "../../../ui/CheckboxCollapsibleGroup/CheckboxCollapsibleGroup";

type FormikCheckboxFieldsGroupProps = {
  name: string;
  label: string;
  children?: React.ReactNode;
  className?: string;
  labelClassName?: string;
};

/**
 *
 * FormikCheckboxFieldsGroup
 *
 * Renders a checkbox group that can be used to toggle the visibility of a set of fields.
 *
 */
export default function FormikCheckboxFieldsGroup({
  name,
  label,
  children,
  labelClassName = "text-sm font-semibold text-gray-700",
  className = "flex flex-col space-y-2 "
}: FormikCheckboxFieldsGroupProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [field] = useField(name);

  const { value } = field;

  // remove empty fields
  useEffect(() => {
    if (values) {
      const fields = name.split(".");
      let current = fields[0];
      for (let i = 1; i < fields.length; i++) {
        // if any of the current fields parent is empty, remove it
        if (isEmpty(get(values, current))) {
          setFieldValue(current, undefined);
          break;
        }
        current = `${current}.${fields[i]}`;
      }
    }
  }, [name, setFieldValue, values]);

  return (
    <CheckboxCollapsibleGroup
      label={label}
      isChecked={!!value || false}
      onChange={(v) => {
        if (!v) {
          setFieldValue(name, undefined);
        }
      }}
      labelClassName={labelClassName}
    >
      <div className={className}>{children}</div>
    </CheckboxCollapsibleGroup>
  );
}
