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
      className="flex w-full justify-center items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        <FaSpinner className="animate-spin inline-block mr-2" size={16} />
      )}
      {getNodeLabel(node)}
    </button>
  );
}
