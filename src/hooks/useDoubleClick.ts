import { useEffect, useRef } from "react";

interface Props {
  latency?: number;
  onDoubleClick: (e: MouseEvent) => void;
}

const useDoubleClick = ({ latency = 300, onDoubleClick = () => {} }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    const clickRef = ref.current;
    let clickCount = 0;

    const handleClick = (e: MouseEvent) => {
      clickCount += 1;

      setTimeout(() => {
        if (clickCount === 2) onDoubleClick(e);

        clickCount = 0;
      }, latency);
    };

    if (!clickRef) return;

    clickRef.addEventListener("click", handleClick);

    return () => {
      clickRef.removeEventListener("click", handleClick);
    };
  });

  return ref;
};

export default useDoubleClick;
