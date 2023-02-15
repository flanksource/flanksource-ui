import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current?.children) {
      const totalHeight = contentRef.current.clientHeight;
      let fixedHeightsTotal = 0;
      let fixedHeightChildCount = 0;
      const children = [...contentRef.current?.children];
      children.forEach((item) => {
        const panelHeight = item.getAttribute("data-panel-height");
        if (panelHeight && panelHeight !== "auto") {
          fixedHeightsTotal += parseInt(panelHeight || "0px", 10);
          ++fixedHeightChildCount;
        }
      });
      const itemHeight =
        (totalHeight - fixedHeightsTotal) /
        (contentRef.current.children.length - fixedHeightChildCount);
      children.forEach((item) => {
        const child = item as HTMLDivElement;
        const panelHeight = item.getAttribute("data-panel-height");
        const height =
          panelHeight === "auto" || !panelHeight
            ? itemHeight
            : `${parseInt(panelHeight, 10)}`;
        child.style.setProperty("max-height", `${height}px`);
      });
    }
  }, [children, contentRef]);

  return (
    <div
      className={clsx(
        `flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 h-screen px-4`,
        open ? "w-3" : "w-[35rem]",
        className
      )}
      {...rest}
      style={{ paddingBottom: "64px" }}
    >
      <div
        className={`flex-1 h-full flex flex-col space-y-2 overflow-y-hidden pb-4 ${
          open ? "hidden" : ""
        }`}
        ref={contentRef}
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
