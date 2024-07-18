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
    <div className="pointer-events-none flex sm:pointer-events-auto">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={onClick}
      >
        {name && <span className="sr-only">{name}</span>}
        <Icon className="h-5 w-auto fill-gray-400" aria-hidden="true" />
      </button>
    </div>
  );
}
