import toast from "react-hot-toast";
import { ToastOptions } from "react-hot-toast/dist/core/types";

type ErrorMessage =
  | {
      response?: {
        data?: {
          error: string;
        };
      };
    }
  | string
  | undefined;

export function toastError(message: ErrorMessage) {
  if (typeof message === "string" || !message) {
    toast.error(message || "An error occurred");
  } else {
    toast.error(message.response?.data?.error || "An error occurred");
  }
}

export function toastSuccess(
  message: string | JSX.Element,
  opts: ToastOptions = {}
) {
  toast.success(message, opts);
}
