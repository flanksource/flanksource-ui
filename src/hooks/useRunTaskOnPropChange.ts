import { useEffect, useRef, useState } from "react";

export default function useRunTaskOnPropChange<T>(
  valFn: () => T,
  task: () => void,
  interval: number = 100
) {
  const ref = useRef<NodeJS.Timer>();
  const [value, setValue] = useState<T>();

  useEffect(() => {
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      if (value !== valFn()) {
        setValue(valFn());
        task();
      }
    }, interval);
    return () => {
      clearInterval(ref.current);
    };
  }, [task, valFn, value, interval]);

  return {
    value
  };
}
