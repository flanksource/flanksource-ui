import { useState } from "react";
import {
  Outlet,
  useSearchParams,
  NavLink,
  useMatch,
  useNavigate
} from "react-router-dom";
import { debounce } from "lodash";
import clsx from "clsx";

import { SearchLayout } from "./search";

import { TextInputClearable } from "../TextInputClearable";

export function ConfigLayout({
  showSearchInput,
  basePath,
  backPath,
  ...props
}) {
  const [params, setParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
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

  const back = backPath ? (
    <div className="mb-4 flex flex-row iems-center">
      <button
        className="border rounded-md px-3 py-1 text-sm"
        type="button"
        onClick={() => navigate(backPath)}
      >
        Back
      </button>
    </div>
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
        <NavLink
          className={({ isActive }) =>
            clsx(
              "rounded-t-md py-2.5 px-4 text-sm leading-5",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
              isActive ? "border border-b-0 border-gray-300" : ""
            )
          }
          key="config"
          to={mt.pathname}
          end
        >
          Config List
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            clsx(
              "rounded-t-md py-2.5 px-4 text-sm leading-5",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
              isActive ? "border border-b-0 border-gray-300" : ""
            )
          }
          key="changes"
          to={`${mt.pathname}/changes`}
          end
        >
          Config Changes
        </NavLink>
      </span>
      <span>{extra}</span>
    </nav>
  );

  return (
    <SearchLayout {...props} title={title}>
      {back}
      {nav}
      <Outlet context={{ title, setTitle }} />
    </SearchLayout>
  );
}
