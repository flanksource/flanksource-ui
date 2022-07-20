import React, { useEffect, useRef, useState, useCallback } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";

const ACTIONS_ID = {
  CHECK_EDITABLE_TEXT: "checkEditableText",
  CLOSE_EDITABLE_TEXT: "closeEditableText"
};

interface IProps {
  value: string;
  textAreaClassName?: string;
  buttonClassName?: string;
  sharedClassName?: string;
  placeholder?: string;
  append?: React.ReactNode;
  onChange: (v: string) => void;
}

export function EditableText({
  value,
  textAreaClassName,
  buttonClassName,
  sharedClassName,
  placeholder,
  append,
  onChange,
  ...rest
}: IProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onBlurTextArea = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (
        !e?.relatedTarget?.id ||
        !Object.values(ACTIONS_ID).includes(e.relatedTarget.id)
      ) {
        setEditMode(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!editMode || !inputRef.current) return;

    inputRef.current.focus();
    const val = inputRef.current.value;
    inputRef.current.value = "";
    inputRef.current.value = val;
  }, [editMode]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setLocalValue(e.target.value),
    []
  );
  const onClickCheck = useCallback(() => {
    onChange(localValue);
    setEditMode(false);
  }, [localValue, onChange]);

  const onClickClose = useCallback(() => {
    setLocalValue(value);
    setEditMode(false);
  }, [value]);

  return (
    <div className="relative w-full" {...rest}>
      {editMode && (
        <>
          <textarea
            className={`w-full min-w-full py-1 px-px resize-none rounded-sm absolute top-0 bottom-0 left-0 right-0 overflow-y-hidden ${textAreaClassName} ${sharedClassName}`}
            defaultValue={localValue}
            onChange={onChangeText}
            onBlur={onBlurTextArea}
            ref={inputRef}
          />
          <div className="absolute right-0 -bottom-7 flex">
            <button
              id={ACTIONS_ID.CHECK_EDITABLE_TEXT}
              className="border border-gray-300 rounded bg-gray-50 mr-1 p-0.5"
              type="button"
              onClick={onClickCheck}
            >
              <IoCheckmark />
            </button>
            <button
              id={ACTIONS_ID.CLOSE_EDITABLE_TEXT}
              className="border border-gray-300 rounded bg-gray-50 p-0.5"
              type="button"
              onClick={onClickClose}
            >
              <IoClose />
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        className={`w-full py-1 px-px text-left border border-transparent hover:border-gray-300 rounded-sm cursor-text ${buttonClassName} ${sharedClassName}`}
        style={{ overflowX: "hidden", wordWrap: "break-word" }}
        onClick={() => setEditMode(true)}
      >
        {(editMode && (
          <span className="whitespace-pre-wrap">{localValue}</span>
        )) ||
          value || (
            <span className="text-gray-400 ">{placeholder || "(empty)"}</span>
          )}
        {append}
      </button>
    </div>
  );
}
