import { useState, useEffect } from "react";

/**
 * Copy from the lower link, with changed naming for more informative variables
 * https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
 *
 * @example usage inside the component to get the latest value
 * const { windowInnerHeight, windowInnerWidth } = useWindowDimensions();
 *
 */
function getWindowDimensions() {
  const { innerWidth: windowInnerWidth, innerHeight: windowInnerHeight } =
    window;
  return {
    windowInnerWidth,
    windowInnerHeight
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
