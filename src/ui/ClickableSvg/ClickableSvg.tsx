import clsx from "clsx";
import { useEffect, useRef } from "react";

type ClickableSvgProps = {
  styleFill?: boolean;
  styleStorke?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function ClickableSvg({
  styleFill = true,
  styleStorke = true,
  children,
  className,
  ...props
}: ClickableSvgProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let classNames: string[] = [];
    if (styleFill) {
      classNames = ["hover:fill-[#5A5B5E]", "active:fill-[#416BDD]"];
    }
    if (styleStorke) {
      classNames = [
        ...classNames,
        "hover:stroke-[#5A5B5E]",
        "active:stroke-[#416BDD]"
      ];
    }
    wrapperRef.current?.querySelector("svg")?.classList?.add(...classNames);
  }, [children, styleFill, styleStorke]);

  return (
    <div
      ref={wrapperRef}
      className={clsx("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}
