import clsx from "clsx";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

type Props = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  hideToggle?: boolean;
};

export default function SlidingSideBar({
  children,
  className,
  hideToggle,
  ...rest
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        ` flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 w-full py-6 px-4
            ${open ? "w-3" : "w-[35rem]"}
          `,
        className
      )}
      {...rest}
    >
      <div
        className={`flex flex-col overflow-y-hidden space-y-8 sticky top-0 ${
          open && "hidden"
        }`}
      >
        {children}
      </div>
      {!hideToggle && (
        <button
          type="button"
          aria-label={open ? "Open Side Panel" : "Close Side Panel"}
          title={open ? "Open Side Panel" : "Close Side Panel"}
          className="absolute text-xl bg-white -left-6 top-6 border border-gray-300 rounded-full transform duration-500 m-2 p-1 hover:bg-gray-200 rotate-180"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
        </button>
      )}
    </div>
  );
}
