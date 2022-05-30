import React, { forwardRef, useEffect, useRef } from "react";

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} className="checkbox" {...rest} />
    );
  }
);
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";
