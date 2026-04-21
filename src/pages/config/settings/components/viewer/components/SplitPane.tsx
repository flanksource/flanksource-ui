import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent
} from "react";

interface Props {
  left: ReactNode;
  right: ReactNode;
  defaultSplit?: number;
  minLeft?: number;
  minRight?: number;
}

export function SplitPane({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  minRight = 20
}: Props) {
  const [split, setSplit] = useState(defaultSplit);
  const dragging = useRef(false);
  const container = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragging.current = true;

      const onMove = (e: MouseEvent) => {
        if (!dragging.current || !container.current) return;
        const rect = container.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setSplit(Math.max(minLeft, Math.min(100 - minRight, pct)));
      };

      const onUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [minLeft, minRight]
  );

  return (
    <div ref={container} className="flex flex-1 overflow-hidden">
      <div style={{ width: `${split}%` }} className="overflow-y-auto bg-white">
        {left}
      </div>
      <div
        className="w-1 shrink-0 cursor-col-resize bg-gray-200 transition-colors hover:bg-blue-400"
        onMouseDown={onMouseDown}
      />
      <div style={{ width: `${100 - split}%` }} className="overflow-y-auto">
        {right}
      </div>
    </div>
  );
}
