import { UnauthorizedMessage } from "@flanksource-ui/components/Permissions/UnauthorizedPage";
import { isAxiosError } from "axios";
import clsx from "clsx";
import { BsFillInfoCircleFill } from "react-icons/bs";

type InfoMessageProps = {
  message: string;
} & React.HTMLProps<HTMLDivElement>;

export function InfoMessage({ message, className }: InfoMessageProps) {
  return (
    <div className={clsx("flex w-full justify-center", className)}>
      <div className="rounded-md bg-gray-100 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BsFillInfoCircleFill />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a query error. A 403 shows the same unauthorized message as the
 * client-side permission check, so both paths look identical.
 */
export function ErrorMessage({ error }: { error: unknown }) {
  if (isAxiosError(error) && error.response?.status === 403) {
    return <UnauthorizedMessage />;
  }

  const message =
    typeof error === "string"
      ? error
      : ((error as { message?: string })?.message ?? "Something went wrong");

  return <InfoMessage message={message} />;
}
