import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { useEffect, useLayoutEffect, useRef } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import useRunTaskOnPropChange from "../../hooks/useRunTaskOnPropChange";

type Props = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  hideToggle?: boolean;
  isSidebarOpen?: boolean;
  onSidebarToggle?: (open: boolean) => void;
};

// when refresh button is clicked, we increment this to trigger refreshes in any
// children listening in on this atom
export const refreshButtonClickedTrigger = atom(0);
const isSlidingSideBarOpenAtom = atom(false);

export default function FloatableSlidingSideBar({
  children,
  className,
  hideToggle,
  isSidebarOpen = false,
  onSidebarToggle = () => {},
  ...rest
}: Props) {
  const [open, setOpen] = useAtom(isSlidingSideBarOpenAtom);
  const contentRef = useRef<HTMLDivElement>(null);

  function configureChildrenHeights() {
    if (!contentRef.current?.children) {
      return;
    }
    const totalHeight = contentRef.current.offsetHeight;
    const collapsedChildren = [...contentRef.current?.children]
      .filter(
        (element) =>
          element.getAttribute("data-minimized") === "true" ||
          element.getAttribute("data-collapsible") === "false"
      )
      .map((element) => element.clientHeight);

    const totalHeightOfMinimizedChildren = collapsedChildren?.reduce(
      (acc, height) => {
        return acc + height;
      },
      0
    );

    [...contentRef.current?.children]
      .filter(
        (element) =>
          element.getAttribute("data-minimized") !== "true" &&
          element.getAttribute("data-collapsible") !== "false"
      )
      .forEach((element) => {
        (element as HTMLDivElement).style.setProperty(
          "max-height",
          `${totalHeight - totalHeightOfMinimizedChildren}px`
        );
      });
  }

  useLayoutEffect(() => {
    // Observe the contentRef for changes in children i.e. when a child is
    // minimized or maximized, we need to update the max-height of the maximized
    // children
    const obs = new window.MutationObserver(() => configureChildrenHeights());
    if (contentRef.current) {
      obs.observe(contentRef.current, {
        childList: true,
        subtree: true
      });
    }
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      configureChildrenHeights();
    }
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    configureChildrenHeights();
  }, [children, contentRef]);

  useEffect(() => {
    // close the sidebar if the user clicks outside the sidebar
    function handleClickOutside(event: any) {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        onSidebarToggle(false);
      }
    }

    function keyPress(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onSidebarToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", keyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", keyPress);
    };
  }, [onSidebarToggle, open]);

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
        `absolute bottom-0 right-0 top-16 z-[99909999999] flex-col border-l border-gray-200 bg-slate-50 px-4 lg:relative lg:top-0 lg:flex lg:self-stretch`,
        open && !hideToggle
          ? "w-[15rem] md:w-[20rem] lg:w-3"
          : "w-[15rem] md:w-[20rem] lg:w-[20rem] xl:w-[30rem]",
        className,
        !hideToggle ? "origin-right transform duration-500" : "",
        isSidebarOpen ? "flex h-full" : "hidden lg:flex"
      )}
      {...rest}
    >
      {/* todo: ensure button is over the content */}
      {!hideToggle && (
        <button
          type="button"
          aria-label={open ? "Open Side Panel" : "Close Side Panel"}
          title={open ? "Open Side Panel" : "Close Side Panel"}
          className="absolute -left-6 top-6 z-[99999999] m-2 hidden rotate-180 transform rounded-full border border-gray-300 bg-white p-1 text-xl duration-500 hover:bg-gray-200 lg:block"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
        </button>
      )}
      <div
        className={`flex h-full flex-col ${
          open && !hideToggle ? "lg:hidden" : ""
        }`}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
}
