import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@flanksource-ui/components/ui/dropdown-menu";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type TabLink = {
  label: React.ReactNode;
  path: string;
  icon?: React.ReactNode;
  search?: string;
  key?: string;
};

type RoutedTabsLinksProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  activeTabName?: string;
  tabLinks: TabLink[];
  // extraTabs renders custom controls (e.g. a dropdown tab) inline at the end
  // of the tab row, after the routed links.
  extraTabs?: React.ReactNode;
  // overflowMenu keeps the tab row on a single line and collapses the tabs that
  // don't fit into a trailing dropdown, preserving the original tab order.
  overflowMenu?: boolean;
};

// Space to reserve for the overflow dropdown trigger before it has been
// measured, so the first layout pass leaves room for it.
const OVERFLOW_TRIGGER_WIDTH = 80;

const tabClassName = (isActive: boolean, overflowMenu: boolean) =>
  clsx(
    "mb-[-2px] cursor-pointer rounded-t-md border border-b-0 border-gray-300 px-4 py-2 text-sm font-medium hover:text-gray-900",
    overflowMenu && "shrink-0 whitespace-nowrap",
    isActive
      ? "bg-white text-gray-900"
      : "border-transparent text-gray-500"
  );

export default function TabbedLinks({
  children,
  className,
  contentClassName = "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto p-2",
  containerClassName = "px-4 py-6 bg-white",
  tabLinks,
  activeTabName,
  extraTabs,
  overflowMenu = false,
  ...rest
}: RoutedTabsLinksProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabWidthsRef = useRef<number[] | null>(null);
  const triggerWidthRef = useRef(OVERFLOW_TRIGGER_WIDTH);
  const [visibleCount, setVisibleCount] = useState(tabLinks.length);
  const tabKeys = tabLinks.map(({ key, path }) => key ?? path).join(",");

  // Fit as many leading tabs as the row can show, reserving room for the
  // overflow trigger when some tabs must be collapsed. Uses widths captured
  // during the full-render measure pass, so it can run on every resize without
  // re-rendering all the tabs.
  const fitTabs = useCallback(() => {
    const container = tabsRef.current;
    const widths = tabWidthsRef.current;
    if (!container || !widths) {
      return;
    }
    const available = container.clientWidth;
    const total = widths.reduce((sum, width) => sum + width, 0);
    if (total <= available) {
      setVisibleCount(widths.length);
      return;
    }
    let used = 0;
    let count = 0;
    for (const width of widths) {
      if (used + width + triggerWidthRef.current > available) {
        break;
      }
      used += width;
      count += 1;
    }
    setVisibleCount(Math.max(count, 1));
  }, []);

  // Re-measure whenever the tab set changes: show every tab, capture their
  // natural widths, then let fitTabs collapse the overflow.
  useLayoutEffect(() => {
    if (!overflowMenu) {
      setVisibleCount(tabLinks.length);
      return;
    }
    tabWidthsRef.current = null;
    setVisibleCount(tabLinks.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overflowMenu, tabKeys]);

  useLayoutEffect(() => {
    if (!overflowMenu) {
      return;
    }
    const container = tabsRef.current;
    if (!container) {
      return;
    }
    if (tabWidthsRef.current === null) {
      // Only measure once every tab is rendered (the full-render pass).
      if (visibleCount !== tabLinks.length) {
        return;
      }
      const nodes =
        container.querySelectorAll<HTMLElement>("[data-tab-link]");
      if (nodes.length !== tabLinks.length) {
        return;
      }
      tabWidthsRef.current = Array.from(nodes).map(
        (node) => node.getBoundingClientRect().width
      );
    }
    const trigger =
      container.querySelector<HTMLElement>("[data-tab-overflow]");
    if (trigger) {
      triggerWidthRef.current = trigger.getBoundingClientRect().width;
    }
    fitTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overflowMenu, tabKeys, visibleCount, fitTabs]);

  useLayoutEffect(() => {
    if (!overflowMenu) {
      return;
    }
    const container = tabsRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(() => fitTabs());
    observer.observe(container);
    return () => observer.disconnect();
  }, [overflowMenu, fitTabs]);

  const visibleTabs = overflowMenu ? tabLinks.slice(0, visibleCount) : tabLinks;
  const overflowTabs = overflowMenu ? tabLinks.slice(visibleCount) : [];
  const isOverflowActive = overflowTabs.some(
    ({ key, path }) => activeTabName === key || pathname === path
  );

  return (
    <div className={clsx("flex min-h-0 flex-1 flex-col", containerClassName)}>
      <div
        ref={tabsRef}
        className={clsx(
          "flex border-b border-gray-300",
          overflowMenu ? "flex-nowrap overflow-hidden" : "flex-wrap",
          className
        )}
        aria-label="Tabs"
        {...rest}
      >
        {visibleTabs.map(({ label, path, key, search, icon }) => (
          <NavLink
            data-tab-link
            className={({ isActive }) =>
              tabClassName(isActive || activeTabName === key, overflowMenu)
            }
            key={path}
            to={{
              pathname: path,
              search
            }}
            end
          >
            <div className="flex flex-row items-center space-x-1">
              {icon} <span>{label}</span>
            </div>
          </NavLink>
        ))}
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              data-tab-overflow
              aria-label="More tabs"
              className={clsx(
                tabClassName(isOverflowActive, overflowMenu),
                "flex items-center space-x-1 focus:outline-none"
              )}
            >
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowTabs.map(({ label, path, key, search, icon }) => (
                <DropdownMenuItem
                  key={path}
                  onClick={() => navigate({ pathname: path, search })}
                  className={clsx(
                    "flex flex-row items-center space-x-2",
                    (activeTabName === key || pathname === path) &&
                      "font-medium text-gray-900"
                  )}
                >
                  {icon} <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {extraTabs}
      </div>
      <div className={clsx("flex flex-col", contentClassName)}>{children}</div>
    </div>
  );
}
