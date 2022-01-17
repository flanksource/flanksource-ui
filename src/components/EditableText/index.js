import React, { useEffect, useRef, useState } from "react";

export function EditableText({
  value,
  textAreaClassName,
  buttonClassName,
  sharedClassName,
  placeholder,
  append,
  onChange,
  ...rest
}) {
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus();
      const val = inputRef.current.value;
      inputRef.current.value = "";
      inputRef.current.value = val;
    }
  }, [editMode]);
  return (
    <div className="relative" {...rest}>
      {editMode && (
        <textarea
          className={`w-full py-0 px-px resize-none rounded-sm absolute top-0 bottom-0 left-0 right-0 overflow-y-hidden ${textAreaClassName} ${sharedClassName}`}
          defaultValue={value}
          onChange={onChange}
          onBlur={() => setEditMode(false)}
          ref={inputRef}
        />
      )}

      <button
        type="button"
        className={`w-full px-px text-left border border-transparent hover:border-gray-300 rounded-sm cursor-text ${buttonClassName} ${sharedClassName}`}
        style={{ overflowX: "hidden", wordWrap: "break-word" }}
        onClick={() => setEditMode(true)}
      >
        {value || (
          <span className="text-gray-400 ">{placeholder || "(empty)"}</span>
        )}
        {append}
      </button>
    </div>
  );
}
