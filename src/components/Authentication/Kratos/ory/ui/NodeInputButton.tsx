import { getNodeLabel } from "@ory/integrations/ui";
import { FormEvent } from "react";

import { NodeInputProps } from "./helpers";

export function NodeInputButton({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit
}: NodeInputProps) {
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = (e: MouseEvent | FormEvent) => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    //
    // Please note that we also need to prevent the default action from happening.
    if (attributes.onclick) {
      e.stopPropagation();
      e.preventDefault();
      // eslint-disable-next-line no-new-func
      const run = new Function(attributes.onclick);
      run();
      return;
    }

    setValue(attributes.value).then(() => dispatchSubmit(e));
  };

  return (
    <button
      name={attributes.name}
      onClick={(e) => {
        onClick(e);
      }}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
      type="button"
    >
      {getNodeLabel(node)}
    </button>
  );
}
