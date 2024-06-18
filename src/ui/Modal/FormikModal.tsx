import { IModalProps, Modal, useDialogSize } from ".";
import { Form, Formik } from "formik";
import { Button } from "../Buttons/Button";
import { Fragment, createContext, useContext, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import DialogButton from "../Buttons/DialogButton";
import HelpLink from "../Buttons/HelpLink";

interface FormikModalProps extends IModalProps {
  initialValues?: Record<string, any>;
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
  props: FormikModalProps;
  setProps: (props: FormikModalProps) => void;
  values: Record<string, any>;
}

export function useFormikModal() {
  let { props, setProps: set, values } = useContext(FormikModalContext)
  let setProps = (p: FormikModalProps) => {
    console.log(p, props)
    set(p)
  }
  return {
    props, setProps, values
  }
}

export const FormikModalContext = createContext<FormikModalContextProps>(undefined!);

export default function FormikModal(initialProps: FormikModalProps) {
  console.log('initial', initialProps.open)
  const [props, setProps] = useState(initialProps);
  console.log('state', props.open)
  const sizeClass = useDialogSize(props.size);
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
        onClose={props.allowBackgroundClose ? () => props.onClose?.() : () => { }}
        {...props}
      >
        <div
          className={clsx("flex items-center justify-center mx-auto my-auto", sizeClass)}        >
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
            <div className={clsx(
              props.size !== "small" && props.childClassName,
              "mt-20 mb-10 justify-between overflow-auto  bg-white rounded-lg text-left shadow-xl transform transition-all  flex flex-col")}
            >
              <div className="py-4 px-4 gap-2 flex item-center rounded-t-lg justify-between bg-gray-100">
                <h1
                  className={clsx(
                    "font-semibold flex-1 overflow-x-auto text-lg",
                    props.titleClass
                  )}
                >
                  {props.title}
                </h1>

                {props.helpLink && <HelpLink link={props.helpLink} />}
                {props.showExpand && props.size !== 'full' && props.size !== 'small' &&
                  <DialogButton icon={BsArrowsFullscreen} onClick={() => setProps({
                    ...props,
                    size: 'full'
                  })} />}

                {props.showExpand && props.size === 'full' && <DialogButton icon={BsFullscreenExit} onClick={() => setProps({
                  ...props,
                  size: 'medium'
                })} />}

                {!props.hideCloseButton && <DialogButton icon={XIcon} onClick={props.onClose} />}
              </div>

              <div className={clsx("flex flex-col flex-1 mb-auto ", props.bodyClass)} >

                <Formik
                  initialValues={props.initialValues!}
                  enableReinitialize={true}
                  onSubmit={(values) => {
                    if (props.onSave) {
                      props.onSave(values);
                    }
                  }}
                  validateOnBlur
                  validateOnChange
                >
                  {({ handleSubmit, handleReset, setFieldTouched, validateField, values }) => (
                    <FormikModalContext.Provider value={{ props, setProps, values }}>
                      <Form
                        onSubmit={(e) => {
                          handleSubmit(e);
                          if (props.touchAllOnSubmit) {
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

                        {(props.showBack || props.showSave || props.showDelete || props.showClose) &&
                          <div className="flex flex-row  bg-gray-100 p-4">
                            <div className="flex flex-1 flex-row items-center space-x-4 ">
                              {props.showBack && props.onBack && (
                                <div className="flex flex-1 flex-row">
                                  <Button className="btn-default btn-btn-secondary-base btn-secondary"
                                    onClick={(e) => {
                                      props.onBack?.()
                                    }}>{props.backTitle}</Button>
                                </div>
                              )}
                              {props.showDelete && props.onDelete &&
                                <Button className="btn-default btn-btn-secondary-base btn-secondary"
                                  onClick={() => {
                                    props.onDelete?.(values)
                                  }}>{props.deleteTitle}</Button>
                              }

                              {props.showClose && props.onClose &&
                                <Button className="btn-primary"
                                  onClick={() => {
                                    props.onClose?.()
                                  }}>{props.closeTitle}</Button>
                              }
                              {props.showSave &&
                                <Button type="submit" className="btn-default btn-primary">{props.saveTitle}</Button>
                              }
                            </div>
                          </div>
                        }
                      </Form>
                    </FormikModalContext.Provider>
                  )}
                </Formik >
              </div>

            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root >
  )
}
