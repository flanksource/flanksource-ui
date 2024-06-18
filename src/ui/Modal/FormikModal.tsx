import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { Fragment, createContext, useContext, useRef, useState } from "react";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { IModalProps, useDialogSize } from ".";
import { Button } from "../Buttons/Button";
import DialogButton from "../Buttons/DialogButton";
import HelpLink from "../Buttons/HelpLink";

interface FormikFormModalProps {
  showBack?: boolean;
  showDelete?: boolean;
  showSave?: boolean;
  showClose?: boolean;
  touchAllOnSubmit?: boolean;
  saveTitle?: string;
  backTitle?: string;
  deleteTitle?: string;
  closeTitle?: string;
  onBack?: () => void;
  onSave?: (values: Record<string, any>) => void | Promise<any>;
  onDelete?: (values: Record<string, any>) => void | Promise<any>;
}

export type FormikModalContextProps = {
  props: FormikFormModalProps;
  setProps: (props: FormikFormModalProps) => void;
  values: Record<string, any>;
};

export function useFormikModal() {
  const { props, setProps: set, values } = useContext(FormikModalContext);
  const setProps = (p: FormikFormModalProps) => {
    set(p);
  };
  return {
    props,
    setProps,
    values
  };
}

export const FormikModalContext = createContext<FormikModalContextProps>(
  undefined!
);

type FormikModalProps = IModalProps & {
  formikFormProps: FormikFormModalProps;
  /**
   * Can only be used during the initial render of the modal, after that, you
   * can use Formik's setFieldValue to update the form values.
   */
  initialValues?: Record<string, any>;
};

export default function FormikModal({
  onClose = () => {},
  formikFormProps,
  size = "medium",
  helpLink,
  showExpand,
  bodyClass,
  initialValues,
  title,
  titleClass,
  hideCloseButton,
  childClassName,
  ...props
}: FormikModalProps) {
  const [formikProps, setFormikProps] = useState<FormikFormModalProps>(() => {
    // set default values for formikFormProps
    const {
      saveTitle = "Save",
      backTitle = "Back",
      deleteTitle = "Delete",
      closeTitle = "Close",
      ...props
    } = formikFormProps;

    return {
      ...props,
      saveTitle,
      backTitle,
      deleteTitle,
      closeTitle
    };
  });

  const [_size, _setSize] = useState(size);
  const sizeClass = useDialogSize(_size);
  const formRef = useRef<HTMLFormElement>(null);

  const touchAllFormFields = (
    setFieldTouched: (
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    [...(formRef.current?.elements || [])].forEach((element) => {
      setFieldTouched(element.getAttribute("name")!, true, true);
    });
  };
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        auto-reopen="true"
        className={props.dialogClassName}
        onClose={(e) => {
          if (props.allowBackgroundClose) {
            onClose();
          }
        }}
        {...props}
      >
        <div
          className={clsx(
            "flex items-center justify-center mx-auto my-auto",
            sizeClass
          )}
        >
          {/* @ts-ignore */}
          <Transition.Child
            as={Fragment as any}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment as any}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                _size !== "small" && childClassName,
                "mt-20 mb-10 justify-between overflow-auto  bg-white rounded-lg text-left shadow-xl transform transition-all  flex flex-col"
              )}
            >
              <div className="py-4 px-4 gap-2 flex item-center rounded-t-lg justify-between bg-gray-100">
                <h1
                  className={clsx(
                    "font-semibold flex-1 overflow-x-auto text-lg",
                    titleClass
                  )}
                >
                  {title}
                </h1>

                {helpLink && <HelpLink link={helpLink} />}
                {showExpand && _size !== "full" && _size !== "small" && (
                  <DialogButton
                    icon={BsArrowsFullscreen}
                    onClick={() => _setSize("full")}
                  />
                )}

                {showExpand && _size === "full" && (
                  <DialogButton
                    icon={BsFullscreenExit}
                    onClick={() => _setSize("medium")}
                  />
                )}

                {!hideCloseButton && (
                  <DialogButton icon={XIcon} onClick={onClose} />
                )}
              </div>

              <div className={clsx("flex flex-col flex-1 mb-auto ", bodyClass)}>
                <Formik
                  initialValues={initialValues!}
                  enableReinitialize={true}
                  onSubmit={(values): void => {
                    if (formikProps.onSave) {
                      formikProps.onSave(values);
                    }
                  }}
                  validateOnBlur
                  validateOnChange
                >
                  {({ handleSubmit, handleReset, setFieldTouched, values }) => (
                    <FormikModalContext.Provider
                      value={{
                        props: formikProps,
                        setProps: setFormikProps,
                        values
                      }}
                    >
                      <Form
                        onSubmit={(e) => {
                          handleSubmit(e);
                          if (formikProps.touchAllOnSubmit) {
                            touchAllFormFields(setFieldTouched);
                          }
                        }}
                        onReset={handleReset}
                        className="flex flex-col  h-full  justify-between flex-1 space-y-4"
                        ref={formRef}
                      >
                        <div className="flex flex-col flex-1 overflow-y-auto  mb-auto space-y-4 px-4 py-4">
                          {props.children}
                        </div>

                        {(formikProps.showBack ||
                          formikProps.showSave ||
                          formikProps.showDelete ||
                          formikProps.showClose) && (
                          <div className="flex flex-row  bg-gray-100 p-4">
                            <div className="flex flex-1 flex-row items-center space-x-4 ">
                              {formikProps.showBack && formikProps.onBack && (
                                <div className="flex flex-1 flex-row">
                                  <Button
                                    className="btn-default btn-btn-secondary-base btn-secondary"
                                    onClick={(e) => {
                                      formikProps.onBack?.();
                                    }}
                                  >
                                    {formikProps.backTitle}
                                  </Button>
                                </div>
                              )}
                              {formikProps.showDelete &&
                                formikProps.onDelete && (
                                  <Button
                                    className="btn-default btn-btn-secondary-base btn-secondary"
                                    onClick={() => {
                                      formikProps.onDelete?.(values);
                                    }}
                                  >
                                    {formikProps.deleteTitle}
                                  </Button>
                                )}

                              {formikProps.showClose && onClose && (
                                <Button
                                  className="btn-primary"
                                  onClick={() => onClose()}
                                >
                                  {formikProps.closeTitle}
                                </Button>
                              )}
                              {formikProps.showSave && (
                                <Button
                                  type="submit"
                                  className="btn-default btn-primary"
                                >
                                  {formikProps.saveTitle}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </Form>
                    </FormikModalContext.Provider>
                  )}
                </Formik>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
