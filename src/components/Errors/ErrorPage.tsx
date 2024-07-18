import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
  error?: Error;
  hideCause?: boolean;
};

export default function ErrorPage({ error, hideCause }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="rounded-md border border-red-300 bg-red-50 px-12 py-10">
        <h1 className="items-center justify-center space-x-2 py-4 text-2xl">
          <FaExclamationTriangle className="inline text-xl" />
          <span>{error?.message ?? "Something went wrong"}</span>
        </h1>
        {error && !hideCause && (
          <>
            <p className="text-black">{error.stack}</p>
            <p className="text-black">{error.cause as any}</p>
          </>
        )}
      </div>
    </div>
  );
}
