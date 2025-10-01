import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikRoleDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikRoleDropdown({
  name,
  label,
  required = false,
  hint,
  className = "flex flex-col space-y-2 py-2"
}: FormikRoleDropdownProps) {
  const options = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Guest", value: "guest" },
    { label: "Viewer", value: "viewer" },
    { label: "Responder", value: "responder" },
    { label: "Commander", value: "commander" }
  ];

  return (
    <FormikSelectDropdown
      name={name}
      className={className}
      options={options}
      label={label}
      required={required}
      hint={hint}
    />
  );
}
