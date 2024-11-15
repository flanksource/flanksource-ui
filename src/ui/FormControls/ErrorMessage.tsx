import clsx from "clsx";
import { useId } from "react";
import { createPortal } from "react-dom";
import { AiFillWarning } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

export default function ErrorMessage({
  message,
  style = "error",
  tooltip = false,
  className = "h-full items-center pl-2 text-center",
  children
}: {
  message?: string;
  className?: string;
  style?: "error" | "success";
  tooltip?: boolean;
  children?: React.ReactNode;
}) {
  const id = useId();

  // @ts-ignore
  let data = message?.response?.data;
  if (data) {
    message = data?.error || data?.message || message;
  }
  if (!message || message === "") {
    return null;
  }

  if (tooltip) {
    return (
      <>
        <div className="flex flex-row space-x-1">
          <AiFillWarning
            data-tooltip-id={id}
            className="h-5 w-5 text-red-500"
          />
          {children}
        </div>
        {createPortal(
          <Tooltip id={id} className="z-[9999999999] max-w-[95vw]">
            <pre className="whitespace-pre-wrap text-sm">{message}</pre>
          </Tooltip>,
          document.body
        )}
      </>
    );
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
      <div className={clsx("flex", className)}>
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
