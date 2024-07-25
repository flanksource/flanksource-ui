import { ReactNode } from "react";

export default function CardButton({
  onClick,
  icon,
  text
}: {
  onClick: () => Promise<void> | void;
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex-1/4 flex min-w-[25ch] max-w-[25ch] flex-col p-2">
      <div
        role="button"
        className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-2 text-center hover:border-blue-200 hover:bg-gray-100"
        onClick={(e) => onClick()}
      >
        <div className="flex flex-col items-center justify-center">{icon}</div>
        <div>{text}</div>
      </div>
    </div>
  );
}
