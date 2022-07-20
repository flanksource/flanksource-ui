import { BsTrash } from "react-icons/bs";
import { IconButton } from "../../IconButton";
import { HypothesisDeleteDialog } from "../HypothesisDeleteDialog";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  onDisprove: () => void;
}

export function HypothesisBarDeleteDialog({
  isOpen,
  onOpen,
  onClose,
  onDelete,
  onDisprove
}: Props) {
  return (
    <>
      <IconButton
        className="bg-transparent"
        onClick={onOpen}
        ovalProps={{
          stroke: "blue",
          height: "18px",
          width: "18px",
          fill: "transparent"
        }}
        icon={
          <BsTrash
            className="text-gray-600 border-0 border-l-1 border-gray-200"
            size={18}
          />
        }
      />

      <HypothesisDeleteDialog
        isOpen={isOpen}
        onClose={onClose}
        onDelete={onDelete}
        onDisprove={onDisprove}
      />
    </>
  );
}
