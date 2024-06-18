import { IconType } from "react-icons";

type DialogButtonProps = {
  icon: IconType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function DialogButton({
  onClick,
  icon,
  ...props
}: DialogButtonProps) {
  const Icon = icon;
  return (
    <div className="flex pointer-events-none sm:pointer-events-auto">
      <button
        {...props}
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={onClick}
      >
        <Icon className="fill-gray-400 w-auto h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
