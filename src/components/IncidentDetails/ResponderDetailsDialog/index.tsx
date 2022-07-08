import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import dayjs from "dayjs";

import { MdTimer } from "react-icons/md";
import {
  AddResponderFormValues,
  formPropKey,
  ResponderPropsKeyToLabelMap
} from "../AddResponder";

type ResponderDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  responder: any;
  data: AddResponderFormValues;
} & React.HTMLProps<HTMLDivElement>;

export function ResponderDetailsDialog({
  responder,
  data,
  onClose,
  open,
  className,
  ...rest
}: ResponderDetailsDialogProps) {
  const getOrderedKeys = (): formPropKey[] => {
    switch (responder?.type) {
      case "Email":
        return ["to", "subject", "body"];
      case "Jira":
        return ["project", "issueType", "summary", "description"];
      case "ServiceNow":
        return ["category", "description", "body"];
      case "CA":
        return ["category", "description", "body"];
      case "AWS Support":
        return ["category", "description", "body"];
      case "AWS AMS Service Request":
        return ["category", "description", "body"];
      case "Redhat":
        return ["product", "category", "description", "body"];
      case "Oracle":
        return ["product", "category", "description", "body"];
      case "Microsoft":
        return ["product", "category", "description", "body"];
      case "VMWare":
        return ["product", "category", "description", "body"];
      case "Person":
        return ["person"];
      default:
        return [];
    }
  };

  const getOptionsList = () => {
    const keys = getOrderedKeys();
    const options: { label: string; value: string | undefined }[] = [];
    keys.forEach((key) => {
      options.push({
        label: ResponderPropsKeyToLabelMap[key],
        value: data?.[key]
      });
    });
    return options;
  };

  const getDateDisplayLabel = (date: string) => {
    if (!date) {
      return "";
    }
    return dayjs(date).format("LT LL");
  };

  return (
    // @ts-ignore:next-line
    <Dialog
      open={open}
      as="div"
      className={clsx("relative z-10", className)}
      onClose={onClose}
      {...rest}
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2/4 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              <div className="flex pointer-events-none sm:pointer-events-auto justify-between items-center">
                <div className="flex-shrink-0">
                  {responder?.icon && <responder.icon className="w-6 h-6" />}
                </div>
                <div className="min-w-0 flex-1 ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {responder?.type}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="drop-shadow w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </Dialog.Title>
            <div className="mt-4 h-64 min-h-full mb-4">
              <div className="lg:border-t lg:border-b lg:border-gray-200 mt-5">
                <nav
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-label="Progress"
                >
                  <ol
                    role="list"
                    className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none"
                  >
                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="border border-gray-200 overflow-hidden border-b-0 rounded-t-md lg:border-0">
                        <a href="#" className="group">
                          <span
                            className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                            aria-hidden="true"
                          ></span>
                          <span className="px-2 py-2 flex items-start text-sm font-medium">
                            <span className="flex-shrink-0">
                              <span className="w-7 h-7 flex items-center justify-center bg-indigo-600 rounded-full">
                                <svg
                                  className="w-6 h-6 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </span>
                            <span className="mt-0.5 ml-2 min-w-0 flex flex-col">
                              <span className="text-xs font-semibold tracking-wide">
                                Created at
                              </span>
                              <span className="text-xs font-medium text-gray-500">
                                {getDateDisplayLabel(
                                  responder?.json?.created_at
                                )}
                              </span>
                            </span>
                          </span>
                        </a>
                      </div>
                      <MdTimer className="absolute top-4 right-2 w-5 h-5" />
                    </li>
                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="border border-gray-200 overflow-hidden lg:border-0">
                        <a href="#" aria-current="step">
                          <span
                            className="absolute top-0 left-0 w-1 h-full bg-indigo-600 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                            aria-hidden="true"
                          ></span>
                          <span className="px-2 py-2 flex items-start text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {responder?.json?.acknowledge_time ? (
                                <span className="w-7 h-7 flex items-center justify-center bg-indigo-600 rounded-full">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="w-7 h-7 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                                  <span className="text-indigo-600">02</span>
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 ml-2 min-w-0 flex flex-col">
                              <span className="text-xs font-semibold text-indigo-600 tracking-wide">
                                Acknowledged at
                              </span>
                              <span className="text-xs font-medium text-gray-500">
                                {getDateDisplayLabel(
                                  responder?.json?.acknowledge_time
                                )}
                              </span>
                            </span>
                          </span>
                        </a>
                        <div
                          className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-full w-full text-gray-300"
                            viewBox="0 0 12 82"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0.5 0V31L10.5 41L0.5 51V82"
                              stroke="currentcolor"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </div>
                      </div>
                      <MdTimer className="absolute top-4 right-2 w-5 h-5" />
                    </li>

                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="border border-gray-200 overflow-hidden border-t-0 rounded-b-md lg:border-0">
                        <a href="#" className="group">
                          <span
                            className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                            aria-hidden="true"
                          ></span>
                          <span className="px-2 py-2 flex items-start text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {responder?.json?.acknowledge_time &&
                              responder?.json?.signoff_time ? (
                                <span className="w-7 h-7 flex items-center justify-center bg-indigo-600 rounded-full">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="w-7 h-7 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                                  <span className="text-indigo-600">03</span>
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 ml-2 min-w-0 flex flex-col">
                              <span className="text-xs font-semibold text-gray-500 tracking-wide">
                                Resolved at
                              </span>
                              <span className="text-xs font-medium text-gray-500">
                                {getDateDisplayLabel(
                                  responder?.json?.signoff_time
                                )}
                              </span>
                            </span>
                          </span>
                        </a>
                        <div
                          className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-full w-full text-gray-300"
                            viewBox="0 0 12 82"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0.5 0V31L10.5 41L0.5 51V82"
                              stroke="currentcolor"
                              vector-effect="non-scaling-stroke"
                            />
                          </svg>
                        </div>
                      </div>
                      <MdTimer className="absolute top-4 right-2 w-5 h-5" />
                    </li>

                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="border border-gray-200 overflow-hidden border-t-0 rounded-b-md lg:border-0">
                        <a href="#" className="group">
                          <span
                            className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                            aria-hidden="true"
                          ></span>
                          <span className="px-2 py-2 flex items-start text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {responder?.json?.signoff_time &&
                              responder?.json?.close_time ? (
                                <span className="w-7 h-7 flex items-center justify-center bg-indigo-600 rounded-full">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="w-7 h-7 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                                  <span className="text-indigo-600">04</span>
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 ml-2 min-w-0 flex flex-col">
                              <span className="text-xs font-semibold text-gray-500 tracking-wide">
                                Closed at
                              </span>
                              <span className="text-xs font-medium text-gray-500">
                                {getDateDisplayLabel(
                                  responder?.json?.close_time
                                )}
                              </span>
                            </span>
                          </span>
                        </a>
                        <div
                          className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-full w-full text-gray-300"
                            viewBox="0 0 12 82"
                            fill="none"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0.5 0V31L10.5 41L0.5 51V82"
                              stroke="currentcolor"
                              vector-effect="non-scaling-stroke"
                            />
                          </svg>
                        </div>
                      </div>
                      <MdTimer className="absolute top-4 right-2 w-5 h-5" />
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="border-gray-200 sm:p-0 mt-4">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {getOptionsList().map((option) => {
                    return (
                      <div
                        className="sm:grid sm:grid-cols-3 sm:gap-4 py-2"
                        key={option.label}
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {option.label}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {option.value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
