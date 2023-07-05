import toast, { ToastOptions } from "react-hot-toast";

type ErrorMessage =
  | {
      response?: {
        data?: {
          error: string;
          message: string;
        };
      };
    }
  | string
  | undefined;

export function toastError(message: ErrorMessage) {
  if (typeof message === "string" || !message) {
    toast.error(message || "An error occurred");
  } else {
    toast.error(
      message.response?.data?.error ||
        message.response?.data?.message ||
        "An error occurred"
    );
  }
}

export function toastSuccess(
  message: string | JSX.Element,
  opts: ToastOptions = {}
) {
  toast.success(message, opts);
}
