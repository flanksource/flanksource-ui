import { clsx } from "clsx";
import { NavLink, useMatch } from "react-router-dom";

const navLinks: { title: string; index?: boolean; path?: string }[] = [
  { title: "Config", index: true },
  { title: "Changes", path: "changes" },
  { title: "Insights", path: "insights" }
];

type Props = {
  basePath: string;
  tabRight?: React.ReactNode;
};

export function ConfigsPageTabs({ basePath, tabRight }: Props) {
  const mt = useMatch({ path: basePath, end: false });

  return (
    <nav className="flex justify-start">
      <div className="flex self-center">
        {navLinks.map((navLink) => (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "rounded-t-md py-2.5 px-4 text-sm leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400",
                isActive ? "border border-b-0 bg-white" : ""
              )
            }
            key={navLink.title}
            to={
              navLink.index ? mt!.pathname : `${mt!.pathname}/${navLink.path}`
            }
            end
          >
            {navLink.title}
          </NavLink>
        ))}
      </div>
      <div>{tabRight}</div>
    </nav>
  );
}
