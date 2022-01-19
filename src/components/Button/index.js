import { Icon } from "../Icon";

export function Button({ className, text, icon, size = "sm" }) {
  switch (size) {
    case "xs":
      className += " px-2.5 py-1.5 text-xs rounded";
      break;
    case "sm":
      className += "  px-3 py-2 text-sm  leading-4 rounded-md ";
      break;
    case "md":
      className += " px-4 py-2 text-sm rounded-md ";
      break;
    case "lg":
      className += " px-4 py-2  text-base rounded-md ";
      break;
    case "xl":
      className += " px-6 py-3  text-base rounded-md ";
      break;
    default:
      className += "  px-3 py-2 text-sm  leading-4 rounded-md ";
  }

  return (
    <button
      type="button"
      className={`${className} inline-flex items-center border border-transparent font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {icon != null && <Icon icon={icon} size={size} />}
      {text}
    </button>
  );
}
