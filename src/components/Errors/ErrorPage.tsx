import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
  error?: Error;
};

export default function ErrorPage({ error }: Props) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div className="border border-red-300 px-12 py-10 rounded-md bg-red-50">
        <h1 className="items-center justify-center space-x-2 py-4 text-2xl">
          <FaExclamationTriangle className="text-xl inline" />
          <span>{error?.message ?? "Something went wrong"}</span>
        </h1>
        {error && (
          <>
            <p className="text-black">{error.stack}</p>
            <p className="text-black">{error.cause as any}</p>
          </>
        )}
      </div>
    </div>
  );
}
