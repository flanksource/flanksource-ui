import { useState } from "react";
import { Outlet, NavLink, useMatch } from "react-router-dom";
import clsx from "clsx";

import { SearchLayout } from "./search";
import ConfigDetailsSidePanel from "../ConfigDetailsSidePanel";

type Props = {
  showSearchInput?: boolean;
  basePath: string;
  navLinks: {
    title: string;
    path?: string;
    index?: boolean;
  }[];
  title: string;
  showSidePanel?: boolean;
};

export function ConfigLayout({
  showSearchInput,
  basePath,
  navLinks,
  showSidePanel = false,
  ...props
}: Props) {
  const [title, setTitle] = useState(props.title || "");
  const [titleExtras, setTitleExtras] = useState();
  const [tabRight, setTabRight] = useState();
  const mt = useMatch({ path: basePath, end: false });

  return (
    <SearchLayout
      {...props}
      title={
        <div className="flex space-x-2">
          <span className="text-lg">{title}</span>
        </div>
      }
      extra={titleExtras}
      contentClass="p-0 h-full"
    >
      <div className="flex flex-row min-h-full h-auto">
        <div className="flex flex-col flex-1 p-6 min-h-full h-auto overflow-hidden">
          <nav className="flex justify-between">
            <span className="flex self-center">
              {navLinks.map((nav) => (
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      "rounded-t-md py-2.5 px-4 text-sm leading-5",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
                      isActive ? "border border-b-0 bg-white" : ""
                    )
                  }
                  key={nav.title}
                  to={nav.index ? mt!.pathname : `${mt!.pathname}/${nav.path}`}
                  end
                >
                  {nav.title}
                </NavLink>
              ))}
            </span>
            <span>{tabRight}</span>
          </nav>
          <Outlet
            context={{
              title,
              setTitle,
              titleExtras,
              setTitleExtras,
              tabRight,
              setTabRight
            }}
          />
        </div>
        {showSidePanel && <ConfigDetailsSidePanel />}
      </div>
    </SearchLayout>
  );
}
