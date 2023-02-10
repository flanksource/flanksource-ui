import clsx from "clsx";
import { useMemo } from "react";

type VerticalSCrollViewProps = React.HTMLProps<HTMLDivElement> & {
  maxHeight?: string;
};

export function VerticalSCrollView({
  maxHeight,
  children,
  className,
  ...props
}: VerticalSCrollViewProps) {
  const styleProps = useMemo(() => {
    return {
      maxHeight
    };
  }, [maxHeight]);

  return (
    <div
      className={clsx("overflow-y-auto", className)}
      {...props}
      style={styleProps}
    >
      {children}
    </div>
  );
}
