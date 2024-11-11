import clsx from "clsx";

export default function ErrorMessage({
  message,
  style = "error"
}: {
  message?: string;
  style?: "error" | "success";
}) {
  if (!message || message === "") {
    return null;
  }

  // @ts-ignore
  let data = message?.response?.data;
  if (data) {
    message = data?.error || data?.message || message;
  }

  return (
    <div
      className={clsx(
        "mt-4 items-center rounded-md p-3 sm:flex",
        style === "error" && "bg-red-50",
        style === "success" && "bg-blue-50/50"
      )}
    >
      {style === "error" && (
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          ></path>
        </svg>
      )}
      {style === "success" && (
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          ></path>
        </svg>
      )}
      <div className="flex h-full items-center pl-2 text-center">
        <h3
          className={clsx(
            "text-sm",
            style === "error" && "text-red-500",
            style === "success" && "text-gray-800"
          )}
        >
          {message}
        </h3>
      </div>
    </div>
  );
}
