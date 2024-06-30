import clsx from "clsx";
import { GoDiff } from "react-icons/go";

export default function ChangeCountIcon({ count }: { count: number; }) {
  if (!count) {
    return null;
  }
  return <CountBar items={[{
    count: count,
    color: clsx(count >= 500 && "bg-red-100 bold text-md"),
    icon: <GoDiff />
  }]} />
}

function num(count: number) {
  let val = `${count}`;
  if (count > 999) {
    return <span className="text-gray-900">{Math.round(count / 1000)}k+</span>
  }
  return val;

}


export type Count = {
  count: number;
  tooltip?: string;
  color?: string;
  icon: React.ReactNode;
}
export function CountBar({
  items,
  height = "h-6",
  textClass = "p-0.5 text-xs text-zinc-500 font-medium",
  iconClass = "px-1  bg-zinc-100",
  borderClass = "border-gray-300",

}: {
  items: Count[];
  height?: "h-5" | "h-6" | "h-7" | "h-8",
  textClass?: string;
  iconClass?: string;
  borderClass?: string;
}) {
  if (items.length === 0) {
    return "no items"
  }

  return <div className="flex flex-row px-2">
    {items.map((item, i, arr) => {
      return <>
        <div className={clsx(i === 0 && "rounded rounded-r-none",
          i > 0 && "rounded-l-none rounded rounded-r-none",
          "border border-r-0 flex items-center justify-center",
          borderClass, iconClass, height)}>
          {item.icon}
        </div>
        <div className={
          clsx(i === arr.length - 1 && "rounded rounded-l-none",
            i > 0 && i < arr.length - 1 && "rounded rounded-l-none rounded-r-none",
            "border flex items-center justify-center min-w-7", borderClass, textClass, height, item.color)} >
          <span className="inline p-1">{num(item.count)}</span>
        </div >
      </>
    })}

  </div >
}
