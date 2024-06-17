import { IconType } from "react-icons";

export default function DialogButton({
  onClick,
  icon
}: {
  onClick: any;
  icon: IconType;
}) {
  const Icon = icon;
  return (
    <div className="flex pointer-events-none sm:pointer-events-auto">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={onClick}
      >
        <Icon className="fill-gray-400 w-auto h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
