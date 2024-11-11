import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbNavProps = {
  list: Array<string | React.ReactNode | { to: string; title: string }>;
  children?: React.ReactNode;
};

export function BreadcrumbNav({ list, children }: BreadcrumbNavProps) {
  const navs = list
    .map((nav, i) => {
      let comp = null;
      if (typeof nav === "string") {
        comp = (
          <span
            key={nav}
            className="mr-1 whitespace-nowrap text-xl font-semibold"
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
            className="mr-1 whitespace-nowrap text-xl font-semibold text-blue-600"
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
        <span key={`spacer-${i}`} className="mr-1 text-2xl text-gray-400">
          /
        </span>
      ];
    })
    .flat()
    .slice(0, -1);

  return (
    <div className="flex flex-shrink-0 items-center">
      {navs}
      {children}
    </div>
  );
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
        "inline-flex flex-row items-center justify-center space-x-2",
        className
      )}
      {...props}
    >
      <h1 className="mr-1 whitespace-nowrap text-xl font-semibold text-blue-600">
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
        "inline-flex flex-row items-center justify-center space-x-2",
        className
      )}
      {...props}
    >
      <h1 className="my-auto whitespace-nowrap text-lg text-gray-500">
        {link && <Link to={link}>{children}</Link>}
        {!link && children}
      </h1>
    </div>
  );
}
