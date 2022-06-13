import toast from "react-hot-toast";

export function toastError(message = "An error occurred") {
  if (message.response?.data?.error) {
    toast.error(message.response.data.error);
  } else {
    toast.error(message);
  }
}

export function toastSuccess(message) {
  toast.success(message);
}
