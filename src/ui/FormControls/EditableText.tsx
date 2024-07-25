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
  isEditableAtStart?: boolean;
  disableEditOnBlur?: boolean;
  append?: React.ReactNode;
  onChange: (v: string) => void;
  onClose?: () => void;
}

export function EditableText({
  value,
  textAreaClassName,
  buttonClassName,
  sharedClassName,
  placeholder,
  append,
  onChange,
  onClose,
  isEditableAtStart = false,
  disableEditOnBlur = true,
  ...rest
}: IProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editMode, setEditMode] = useState(isEditableAtStart);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeFnRef = useRef(onClose);

  const onBlurTextArea = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (
        disableEditOnBlur &&
        (!e?.relatedTarget?.id ||
          !Object.values(ACTIONS_ID).includes(e.relatedTarget.id))
      ) {
        setEditMode(false);
      }
    },
    [disableEditOnBlur]
  );

  useEffect(() => {
    closeFnRef.current = onClose;
  }, [onClose]);

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
    closeFnRef.current && closeFnRef.current();
  }, [value]);

  return (
    <div className="relative w-full" {...rest}>
      {editMode && (
        <>
          <textarea
            className={`absolute bottom-0 left-0 right-0 top-0 w-full min-w-full resize-none overflow-y-hidden rounded-sm px-px py-1 ${textAreaClassName} ${sharedClassName}`}
            defaultValue={localValue}
            onChange={onChangeText}
            onBlur={onBlurTextArea}
            ref={inputRef}
          />
          <div className="absolute -bottom-7 right-0 flex">
            <button
              id={ACTIONS_ID.CHECK_EDITABLE_TEXT}
              className="mr-1 rounded border border-gray-300 bg-gray-50 p-0.5"
              type="button"
              onClick={onClickCheck}
            >
              <IoCheckmark />
            </button>
            <button
              id={ACTIONS_ID.CLOSE_EDITABLE_TEXT}
              className="rounded border border-gray-300 bg-gray-50 p-0.5"
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
        className={`w-full cursor-text rounded-sm border border-transparent px-px py-1 text-left hover:border-gray-300 ${buttonClassName} ${sharedClassName}`}
        style={{ overflowX: "hidden", wordWrap: "break-word" }}
        onClick={() => setEditMode(true)}
      >
        {(editMode && (
          <span className="whitespace-pre-wrap">{localValue}</span>
        )) ||
          value || (
            <span className="text-gray-400">{placeholder || "(empty)"}</span>
          )}
        {append}
      </button>
    </div>
  );
}
