import { useField, useFormikContext } from "formik";
import CheckboxCollapsibleGroup from "../../CheckboxCollapsibleGroup/CheckboxCollapsibleGroup";
import { useEffect } from "react";
import { get, isEmpty } from "lodash";

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
  className = "flex flex-col p-2 space-y-2 border border-gray-200 rounded-md"
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
      className="flex-1 flex flex-col px-2 py-2 transform origin-top duration-1000"
    >
      <div className={className}>{children}</div>
    </CheckboxCollapsibleGroup>
  );
}
