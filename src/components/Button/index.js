import Icon from '../Icon';

export default function Button({ className, text, icon, size = "sm", ...props }) {

  var iconClass
  switch (size) {
    case "xs":
      className += " px-2.5 py-1.5 text-xs rounded";

      break;
    case "sm":
      className += "  px-3 py-2 text-sm  leading-4 rounded-md ";
      iconClass = "-ml-0.5 mr-2 h-4 w-4";
      break;

    case "md":
      className += " px-4 py-2 text-sm rounded-md ";
      iconClass = "-ml-1 mr-2 h-5 w-5";
      break;

    case "lg":
      className += " px-4 py-2  text-base rounded-md ";
      iconClass = "-ml-1 mr-3 h-5 w-5";
      break;

    case "xl":
      className += " px-6 py-3  text-base rounded-md ";
      iconClass = "-ml-1 mr-3 h-5 w-5";
      break;
  }

  return (
    <button
      type="button"
      {...props}
      className={`" ${className} inline-flex items-center  border border-transparent font-medium  shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"`}
    >
      {icon != null && <Icon icon={icon} size={size} />}
      {text}
    </button>

  )
}




