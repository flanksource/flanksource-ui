import { Outlet, useSearchParams, NavLink } from "react-router-dom";
import { debounce } from "lodash";
import clsx from "clsx";

import { SearchLayout } from "./search";

import { TextInputClearable } from "../TextInputClearable";

export function ConfigLayout({ showSearchInput, ...props }) {
  const [params, setParams] = useSearchParams();

  const extra = (
    <TextInputClearable
      onChange={debounce((e) => {
        const query = e?.target?.value || "";
        setParams({ query });
      }, 200)}
      className="w-80"
      placeholder="Search for configs"
      defaultValue={params.get("query")}
    />
  );

  const nav = (
    <nav
      className="flex justify-between"
      style={{
        borderBottom: "solid 1px lightgray",
        marginBottom: "1rem"
      }}
    >
      <span className="self-center">
        <NavLink
          className={({ isActive }) =>
            clsx(
              "rounded-t-md py-2.5 px-4 text-sm leading-5",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 mb-2",
              isActive ? "border border-b-0 border-gray-300" : ""
            )
          }
          key="config"
          to="/config"
        >
          Config List
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            clsx(
              "rounded-t-md py-2.5 px-4 text-sm leading-5",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 mb-2",
              isActive ? "border border-b-0 border-gray-300" : ""
            )
          }
          key="changes"
          to="/config/changes"
        >
          Config Changes
        </NavLink>
      </span>
      {showSearchInput && <span>{extra}</span>}
    </nav>
  );

  return (
    <SearchLayout {...props}>
      {nav}
      <Outlet />
    </SearchLayout>
  );
}
