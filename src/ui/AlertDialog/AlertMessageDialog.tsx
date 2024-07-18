import React from "react";
import { Button } from "../Buttons/Button";
import { Modal } from "../Modal";

type AlertMessageDialogProps = {
  showDialog?: boolean;
  message: React.ReactNode;
  title: React.ReactNode;
  onCloseDialog: (showDialog: boolean) => void;
  kind?: "error" | "success";
};

export function AlertMessageDialog({
  showDialog = false,
  onCloseDialog = () => {},
  message,
  title,
  kind = "success"
}: AlertMessageDialogProps) {
  return (
    <Modal
      actions={[
        <Button
          key="close"
          className={kind === "error" ? "btn-danger" : "btn-primary"}
          text="Close"
          onClick={() => onCloseDialog(false)}
        />
      ]}
      size={"medium"}
      title={title}
      open={showDialog}
      onClose={() => onCloseDialog(false)}
      footerClassName="flex justify-end bg-gray-200 p-2 my-0"
      bodyClass="text-sm py-2"
    >
      <div className="block w-full px-4 py-2">{message}</div>
    </Modal>
  );
}
