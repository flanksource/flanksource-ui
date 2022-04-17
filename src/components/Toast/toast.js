import toast from "react-hot-toast";

export function toastError(message) {
  if (message == null) {
    message = "An error occurred";
  }
  // eslint-disable-next-line no-console
  console.error(message);
  if (message.response && message.response.data.error) {
    toast.error(message.response.data.error);
  } else {
    toast.error(message);
  }
}
