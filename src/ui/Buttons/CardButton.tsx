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
    <div className="flex flex-col flex-1/4 p-2  min-w-[25ch] max-w-[25ch]">
      <div
        role="button"
        className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
        onClick={(e) => onClick()}
      >
        <div className="flex flex-col items-center justify-center">{icon}</div>
        <div>{text}</div>
      </div>
    </div>
  );
}
