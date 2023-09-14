import { UiNodeAnchorAttributes } from "@ory/client";
import { UiNode } from "@ory/client";
import { useRouter } from "next/router";

interface Props {
  node: UiNode;
  attributes: UiNodeAnchorAttributes;
}

export const NodeAnchor = ({ attributes }: Props) => {
  const { push } = useRouter();

  return (
    <button
      className="font-medium text-indigo-600 hover:text-indigo-500"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        push(attributes.href);
      }}
    >
      {attributes.title.text}
    </button>
  );
};
