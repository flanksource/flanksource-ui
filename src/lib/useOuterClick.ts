import { useRef, useEffect } from "react";

export function useOuterClick<T extends HTMLElement = HTMLDivElement>(
  callback: (e: MouseEvent) => void
) {
  const callbackRef = useRef<typeof callback>(); // initialize mutable ref, which stores callback
  const innerRef = useRef<T>(null); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(e: MouseEvent) {
      if (
        innerRef.current &&
        callbackRef.current &&
        e?.target &&
        !innerRef.current.contains(e.target as Node) // https://stackoverflow.com/a/55808408
      )
        callbackRef.current(e);
    }
  }, []); // no dependencies -> stable click listener

  return innerRef; // convenience for client (doesn't need to init ref himself)
}
