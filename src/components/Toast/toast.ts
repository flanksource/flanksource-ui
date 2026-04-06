import { getErrorMessage } from "@flanksource-ui/api/types/error";
import toast, { ToastOptions } from "react-hot-toast";

export function toastError(message: unknown) {
  if (typeof message === "string") {
    toast.error(message || "An error occurred");
  } else {
    toast.error(getErrorMessage(message) || "An error occurred");
  }
}

export function toastSuccess(
  message: string | JSX.Element,
  opts: ToastOptions = {}
) {
  toast.success(message, opts);
}
