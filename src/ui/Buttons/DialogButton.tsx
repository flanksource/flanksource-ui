import { IconType } from "react-icons";

export default function DialogButton({
  onClick,
  icon,
  name
}: {
  onClick: any;
  icon: IconType;
  name?: string;
}) {
  const Icon = icon;
  return (
    <div className="flex pointer-events-none sm:pointer-events-auto">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={onClick}
      >
        {name && <span className="sr-only">{name}</span>}
        <Icon className="fill-gray-400 w-auto h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
