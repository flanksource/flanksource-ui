import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";
import { FaSpinner } from "react-icons/fa";

export function NodeInputSubmit({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit
}: NodeInputProps) {
  return (
    <button
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      name={attributes.name}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
      type="submit"
      // spread the attributes conditionally
      {...(node.group !== "oidc"
        ? {
            onClick: (e) => {
              // On click, we set this value, and once set, dispatch the submission!
              setValue(attributes.value).then(() => dispatchSubmit(e));
            }
          }
        : {})}
    >
      {disabled && node.group !== "oidc" && (
        <FaSpinner className="mr-2 inline-block animate-spin" size={16} />
      )}
      {getNodeLabel(node)}
    </button>
  );
}
