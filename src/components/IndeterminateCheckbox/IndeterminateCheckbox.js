import React, { forwardRef, useEffect, useRef } from "react";
import clsx from "clsx";

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, className, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          className={clsx("", className)}
          ref={resolvedRef}
          {...rest}
        />
      </>
    );
  }
);
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";
