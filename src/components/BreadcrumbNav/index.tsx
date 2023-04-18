import clsx from "clsx";
import React, { Children } from "react";
import { Link } from "react-router-dom";

type BreadcrumbNavProps = {
  list: Array<string | React.ReactNode | { to: string; title: string }>;
};

export function BreadcrumbNav({ list }: BreadcrumbNavProps) {
  const navs = list
    .map((nav, i) => {
      let comp = null;
      if (typeof nav === "string") {
        comp = (
          <span
            key={nav}
            className="text-xl font-semibold whitespace-nowrap mr-1"
          >
            {nav}
          </span>
        );
      } else if (
        nav &&
        typeof nav === "object" &&
        "to" in nav &&
        "title" in nav
      ) {
        comp = (
          <Link
            key={nav.to}
            to={nav.to}
            className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1"
          >
            {nav.title}
          </Link>
        );
      } else {
        /* eslint-disable react/no-array-index-key */
        comp = (
          <span key={`bc-${i}`} className="mr-1 flex items-center">
            {nav}
          </span>
        );
        /* eslint-enable react/no-array-index-key */
      }
      return [
        comp,
        // eslint-disable-next-line react/no-array-index-key
        <span key={`spacer-${i}`} className="text-gray-400 text-2xl mr-1">
          /
        </span>
      ];
    })
    .flat()
    .slice(0, -1);

  return <div className="flex items-center flex-shrink-0">{navs}</div>;
}

type BreadcrumbRootProps = {
  link?: string;
} & React.HTMLProps<HTMLDivElement>;

export function BreadcrumbRoot({
  children,
  link,
  className,
  ...props
}: BreadcrumbRootProps) {
  return (
    <div
      className={clsx(
        "inline-flex flex-row space-x-2 items-center justify-center",
        className
      )}
      {...props}
    >
      <h1 className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1">
        {link && <Link to={link}>{children}</Link>}
        {!link && children}
      </h1>
    </div>
  );
}

type BreadcrumbChildProps = {
  link?: string;
} & React.HTMLProps<HTMLDivElement>;

export function BreadcrumbChild({
  children,
  link,
  className,
  ...props
}: BreadcrumbChildProps) {
  return (
    <div
      className={clsx(
        "inline-flex flex-row space-x-2 items-center justify-center",
        className
      )}
      {...props}
    >
      <h1 className="text-gray-500 my-auto text-lg whitespace-nowrap">
        {link && <Link to={link}>{children}</Link>}
        {!link && children}
      </h1>
    </div>
  );
}
