import { NodeInputProps } from "./helpers";

export function NodeInputCheckbox({
  node,
  attributes,
  setValue,
  disabled
}: NodeInputProps) {
  // Render a checkbox.s
  return (
    <input
      type="checkbox"
      name={attributes.name}
      defaultChecked={attributes.value === true}
      onChange={(e) => setValue(e.target.checked)}
      disabled={attributes.disabled || disabled}
    />
  );
}
