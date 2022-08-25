import { getNodeLabel } from "@ory/integrations/ui";

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
      label={getNodeLabel(node)}
      state={
        node.messages.find(({ type }) => type === "error") ? "error" : undefined
      }
      subtitle={node.messages.map(({ text }) => text).join("\n")}
    />
  );
}
