import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import useRunTaskOnPropChange from "../../hooks/useRunTaskOnPropChange";
import { atom } from "jotai";

type Props = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  hideToggle?: boolean;
};

// when refresh button is clicked, we increment this to trigger refreshes in any
// children listening in on this atom
export const refreshButtonClickedTrigger = atom(0);

export default function SlidingSideBar({
  children,
  className,
  hideToggle,
  ...rest
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  function calculateChildHeight(
    panelHeight: string,
    itemHeight: number,
    panelHeightRatio: number
  ) {
    return panelHeight === "auto"
      ? itemHeight * panelHeightRatio
      : parseFloat(panelHeight!);
  }

  function configureChildrenHeights() {
    if (!contentRef.current?.children) {
      return;
    }
    const totalHeight = contentRef.current.clientHeight;
    let fixedHeightsTotal = 0;
    let fixedHeightChildCount = 0;
    let expandedChildCount = 0;
    const children = [...contentRef.current?.children];
    children.forEach((item) => {
      let panelHeight = item.getAttribute("data-panel-height");
      if (item.getAttribute("data-minimized") === "true") {
        panelHeight = `${item.clientHeight}px`;
      } else {
        ++expandedChildCount;
      }
      let panelHeightRatio = item.getAttribute("data-panel-height-ratio");
      if (panelHeight && panelHeight !== "auto") {
        fixedHeightsTotal += parseFloat(panelHeight || "0px");
        ++fixedHeightChildCount;
      } else {
        item.setAttribute("data-panel-height", "auto");
      }
      if (!panelHeightRatio) {
        item.setAttribute("data-panel-height-ratio", "1");
      }
    });
    const childrenWithAutoHeight = children.length - fixedHeightChildCount;
    const remainingHeight = totalHeight - fixedHeightsTotal;
    const itemHeight = remainingHeight / childrenWithAutoHeight;
    children.forEach((item) => {
      const child = item as HTMLDivElement;
      let panelHeight = item.getAttribute("data-panel-height");
      if (item.getAttribute("data-minimized") === "true") {
        panelHeight = `${item.clientHeight}px`;
      }
      const panelHeightRatio = parseFloat(
        item.getAttribute("data-panel-height-ratio")!
      );
      const height = calculateChildHeight(
        panelHeight!,
        itemHeight,
        expandedChildCount === 1 ? 0.95 : panelHeightRatio
      );
      child.style.setProperty("max-height", `${height}px`);
    });
  }

  useEffect(() => {
    configureChildrenHeights();
  }, [children, contentRef]);

  useRunTaskOnPropChange(
    () => {
      if (!contentRef.current?.children) {
        return;
      }
      const children = [...contentRef.current?.children];
      let minimizedChildCount = 0;
      children.forEach((child) => {
        minimizedChildCount +=
          child.getAttribute("data-minimized") === "true" ? 1 : 0;
      });
      return minimizedChildCount;
    },
    () => {
      configureChildrenHeights();
    }
  );

  return (
    <div
      className={clsx(
        `flex flex-col bg-white border-l border-gray-200 h-screen px-4`,
        open ? "w-3" : "w-[35rem]",
        className,
        !hideToggle ? "transform origin-right duration-500" : ""
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
