import { useEffect, useRef, useState } from "react";

export function useOnMouseActivity() {
  const ref = useRef<HTMLElement>();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current?.contains(event.target as HTMLElement)) {
        return;
      }
      setIsActive(false);
    };
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  return { ref, isActive, setIsActive };
}
