import { UiNodeAnchorAttributes } from "@ory/client";
import { UiNode } from "@ory/client";

interface Props {
  node: UiNode;
  attributes: UiNodeAnchorAttributes;
}

export const NodeAnchor = ({ attributes }: Props) => {
  return (
    <button
      className="font-medium text-indigo-600 hover:text-indigo-500"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = attributes.href;
      }}
    >
      {attributes.title.text}
    </button>
  );
};
