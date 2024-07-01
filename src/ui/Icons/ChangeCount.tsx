import clsx from "clsx";
import { GoDiff } from "react-icons/go";
import { Link } from "react-router-dom";

export default function ChangeCountIcon({ count }: { count: number }) {
  if (!count) {
    return null;
  }
  return (
    <CountBar
      items={[
        {
          count: count,
          color: clsx(count >= 500 && "bg-red-100 bold text-md"),
          icon: <GoDiff />
        }
      ]}
    />
  );
}

function num(count: number | string) {
  let val = `${count}`;

  if (typeof count == "number" && count > 999) {
    return <span className="text-gray-900">{Math.round(count / 1000)}k+</span>;
  }
  return val;
}

function roundedStyle(style: "RAG" | "icons", i: number) {
  if (style === "RAG") {
    return "rounded";
  }
  if (i === 0) {
    return "rounded rounded-r-none";
  }
  if (i > 0) {
    return "rounded-l-none rounded rounded-r-none";
  }
  return "";
}

function roundedStyleValue(style: "RAG" | "icons", i: number, length: number) {
  if (style === "RAG") {
    return "rounded ";
  }

  if (i === length - 1) {
    return "border rounded rounded-l-none";
  }
  if (i > 0 && i < length - 1) {
    return "border rounded rounded-l-none rounded-r-none";
  }
  return "";
}

export type Count = {
  count: number | string;
  tooltip?: string;
  url?: string;
  target?: string;
  color?: string;
  icon?: React.ReactNode;
};
export function CountBar({
  items,
  height = "h-6",
  barStyle = "icons",
  textClass = "p-0.5 text-xs text-zinc-500 font-medium",
  iconClass = "px-1  bg-zinc-100",
  borderClass = "border-gray-300"
}: {
  items: Count[];
  height?: "h-5" | "h-6" | "h-7" | "h-8";
  barStyle?: "RAG" | "icons";
  textClass?: string;
  iconClass?: string;
  borderClass?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  textClass = clsx(
    barStyle === "icons" && textClass,
    barStyle === "RAG" && "p-0.5 text-xs  "
  );

  borderClass = clsx(barStyle === "icons" && borderClass);

  return (
    <div
      className={clsx(
        "flex flex-row px-2",
        barStyle === "RAG" && "space-x-0.5"
      )}
    >
      {items.map((item, i, arr) => {
        let cell = (
          <>
            {item.icon && (
              <div
                className={clsx(
                  roundedStyle(barStyle, i),
                  "border border-r-0 flex items-center justify-center",
                  borderClass,
                  iconClass,
                  height
                )}
              >
                {item.icon}
              </div>
            )}
            <div
              className={clsx(
                barStyle === "RAG" &&
                  `border-${item.color?.replaceAll("bg-", "")}`,
                roundedStyleValue(barStyle, i, arr.length),
                "border flex items-center justify-center min-w-7",
                borderClass,
                textClass,
                height,
                item.color
              )}
            >
              <span className="inline p-1">{num(item.count)}</span>
            </div>
          </>
        );

        if (item.url) {
          return (
            <Link
              className="inline-flex space-x-1 cursor-pointer"
              key={item.url}
              to={item.url}
              target={item.target || ""}
            >
              {cell}
            </Link>
          );
        }
        return cell;
      })}
    </div>
  );
}
