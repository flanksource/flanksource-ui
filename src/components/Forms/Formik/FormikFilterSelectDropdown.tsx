import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { useField } from "formik";

type FormikFilterMultiDropdownProps = {
  name: string;
  defaultValue?: string;
} & Omit<
  React.ComponentProps<typeof ReactSelectDropdown>,
  "onChange" | "value" | "name"
>;

export default function FormikFilterSelectDropdown({
  name,
  defaultValue = "all",
  ...props
}: FormikFilterMultiDropdownProps) {
  const [field] = useField({
    name: name,
    type: "text"
  });

  return (
    <ReactSelectDropdown
      {...props}
      value={field.value ?? defaultValue}
      onChange={(value) => {
        if (value && value !== "All") {
          field.onChange({
            target: { name: name, value: value }
          });
        } else {
          field.onChange({
            target: { name: name, value: undefined }
          });
        }
      }}
      name={name}
    />
  );
}
