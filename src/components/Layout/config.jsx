import { useState } from "react";
import { Outlet, useSearchParams, NavLink, useMatch } from "react-router-dom";
import { debounce } from "lodash";
import clsx from "clsx";

import { SearchLayout } from "./search";

import { TextInputClearable } from "../TextInputClearable";

export function ConfigLayout({
  showSearchInput,
  basePath,
  backPath,
  navLinks,
  ...props
}) {
  const [params, setParams] = useSearchParams();
  const [title, setTitle] = useState(props.title || "");
  const mt = useMatch({ path: basePath, end: false });

  const extra = showSearchInput ? (
    <TextInputClearable
      onChange={debounce((e) => {
        const query = e.target.value || "";
        setParams({ query });
      }, 200)}
      className="w-80"
      placeholder="Search for configs"
      defaultValue={params.get("query")}
    />
  ) : null;

  const nav = (
    <nav
      className="flex justify-between"
      style={{
        borderBottom: "solid 1px lightgray",
        marginBottom: "1rem"
      }}
    >
      <span className="flex self-center">
        {navLinks.map((nav) => (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "rounded-t-md py-2.5 px-4 text-sm leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
                isActive ? "border border-b-0 border-gray-300" : ""
              )
            }
            key={nav.title}
            to={nav.index ? mt.pathname : `${mt.pathname}/${nav.path}`}
            end
          >
            {nav.title}
          </NavLink>
        ))}
      </span>
      <span>{extra}</span>
    </nav>
  );

  return (
    <SearchLayout
      {...props}
      title={
        <div className="flex space-x-2">
          <span className="text-lg">{title}</span>
        </div>
      }
    >
      {nav}
      <Outlet context={{ title, setTitle }} />
    </SearchLayout>
  );
}
