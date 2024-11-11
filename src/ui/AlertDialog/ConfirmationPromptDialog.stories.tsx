import { ConfirmationPromptDialog } from "./ConfirmationPromptDialog";

// CSF 3.0
export default {
  component: ConfirmationPromptDialog,
  title: "ConfirmationPromptDialog"
};
export const Primary = {
  args: {
    title: "Delete something",
    description: "Do you want to delete this item?, not but really?",
    isOpen: true,
    yesLabel: "Delete",
    closeLabel: "Close",
    isLoading: false
    // className: "",
  }
};

export const Approve = {
  args: {
    confirmationStyle: "approve",
    title: "Approve",
    description: "Do you want to approve this item",
    isOpen: true,
    yesLabel: "Approve",
    closeLabel: "Close",
    isLoading: false
    // className: "",
  }
};
