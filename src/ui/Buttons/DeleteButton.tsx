import { useState } from "react";
import {
  ConfirmationPromptDialog,
  ConfirmationPromptDialogProps
} from "../AlertDialog/ConfirmationPromptDialog";
import { Button } from "./Button";
import { BsTrash } from "react-icons/bs";

export default function DeleteButton({
  yesLabel,
  title = "Delete resource",
  description = "Are you sure you want to delete this resource?",
  ...props
}: {
  title?: string;
  description?: string;
} & Omit<
  ConfirmationPromptDialogProps,
  "isOpen" | "onClose" | "title" | "description"
>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConfirmationPromptDialog
        title={title}
        description={description}
        isOpen={open}
        onClose={() => setOpen(false)}
        className="z-[9999]"
        {...props}
      />

      <Button onClick={() => setOpen(true)} className="btn-danger">
        <BsTrash className="mr-0.5" /> {yesLabel}
      </Button>
    </>
  );
}
