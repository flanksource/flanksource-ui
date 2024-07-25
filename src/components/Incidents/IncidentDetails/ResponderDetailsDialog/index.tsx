/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { MdTimer } from "react-icons/md";
import { relativeDateTime } from "../../../../utils/date";

import { ComponentProps } from "react";
import {
  AddResponderFormValues,
  getOrderedKeys,
  getResponderTitleByValue,
  ResponderOption,
  ResponderPropsKeyToLabelMap
} from "../AddResponders/AddResponder";

type ResponderDetailsDialogProps = {
  open: boolean;
  size: string;
  onClose: () => void;
  responder: any;
  data: AddResponderFormValues;
} & ComponentProps<typeof Dialog>;

export function ResponderDetailsDialog({
  size,
  responder,
  data,
  onClose,
  open,
  className,
  ...rest
}: ResponderDetailsDialogProps) {
  const getOptionsList = () => {
    const keys = getOrderedKeys(responder);
    const options: ResponderOption[] = [];
    keys.forEach((key) => {
      options.push({
        label:
          ResponderPropsKeyToLabelMap[
            key as keyof typeof ResponderPropsKeyToLabelMap
          ],
        value: data?.[key] ?? undefined,
        link: responder.properties.find(
          (v: ResponderOption) =>
            v.label ===
            ResponderPropsKeyToLabelMap[
              key as keyof typeof ResponderPropsKeyToLabelMap
            ]
        )?.link
      });
    });
    if (responder?.json?.acknowledge_time) {
      options.push({
        label: "Time taken to acknowledge",
        value: relativeDateTime(
          responder?.json?.created_at,
          responder?.json?.acknowledge_time
        )
      });
    }
    return options;
  };

  const getDateDisplayLabel = (date: string) => {
    if (!date) {
      return "";
    }
    return relativeDateTime(date);
  };

  const currentStageKey = () => {
    if (!responder?.json?.acknowledge_time) {
      return "acknowledge_time";
    } else if (!responder?.json?.signoff_time) {
      return "signoff_time";
    } else if (!responder?.json?.close_time) {
      return "close_time";
    }
  };

  const getStepElement = (key: string, step: string) => {
    if (currentStageKey() === key) {
      return (
        <MdTimer className="flex h-7 w-7 items-center justify-center rounded-full" />
      );
    }
    if (responder?.json?.[key]) {
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
          <svg
            className="h-6 w-6 text-white"
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
      );
    }
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600">
        <span className="text-blue-600">{step}</span>
      </span>
    );
  };

  return (
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
          <Dialog.Panel className="w-dialog-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              <div className="pointer-events-none flex items-center justify-between sm:pointer-events-auto">
                <div className="flex-shrink-0">
                  {responder?.icon && <responder.icon className="h-6 w-6" />}
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getResponderTitleByValue(responder?.type)}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6 drop-shadow" aria-hidden="true" />
                </button>
              </div>
            </Dialog.Title>
            <div className="mb-4 mt-4 min-h-full">
              <div className="mt-5 lg:border-b lg:border-t lg:border-gray-200">
                <nav className="mx-auto max-w-7xl" aria-label="Progress">
                  <ol className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="overflow-hidden rounded-t-md border border-b-0 border-gray-200 lg:border-0">
                        <a href="#" className="group">
                          <span className="flex items-start px-2 py-2 text-sm font-medium">
                            <span className="flex-shrink-0">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
                                <svg
                                  className="h-6 w-6 text-white"
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
                            <span className="ml-2 mt-0.5 flex min-w-0 flex-col">
                              <span className="text-xs font-semibold tracking-wide">
                                Created
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
                    </li>
                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="overflow-hidden border border-gray-200 lg:border-0">
                        <a href="#" aria-current="step">
                          {currentStageKey() === "acknowledge_time" && (
                            <span
                              className="absolute left-0 top-0 h-full w-1 bg-blue-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                              aria-hidden="true"
                            ></span>
                          )}
                          <span className="flex items-start px-2 py-2 text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {getStepElement("acknowledge_time", "02")}
                            </span>
                            <span className="ml-2 mt-0.5 flex min-w-0 flex-col">
                              <span className="text-xs font-semibold tracking-wide text-blue-600">
                                Acknowledged
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
                          className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
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
                    </li>

                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="overflow-hidden rounded-b-md border border-t-0 border-gray-200 lg:border-0">
                        <a href="#" className="group">
                          {currentStageKey() === "signoff_time" && (
                            <span
                              className="absolute left-0 top-0 h-full w-1 bg-blue-600 group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                              aria-hidden="true"
                            ></span>
                          )}
                          <span className="flex items-start px-2 py-2 text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {getStepElement("signoff_time", "03")}
                            </span>
                            <span className="ml-2 mt-0.5 flex min-w-0 flex-col">
                              <span className="text-xs font-semibold tracking-wide text-gray-500">
                                Resolved
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
                          className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
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
                    </li>

                    <li className="relative overflow-hidden lg:flex-1">
                      <div className="overflow-hidden rounded-b-md border border-t-0 border-gray-200 lg:border-0">
                        <a href="#" className="group">
                          {currentStageKey() === "close_time" && (
                            <span
                              className="absolute left-0 top-0 h-full w-1 bg-blue-600 group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                              aria-hidden="true"
                            ></span>
                          )}
                          <span className="flex items-start px-2 py-2 text-sm font-medium lg:pl-4">
                            <span className="flex-shrink-0">
                              {getStepElement("close_time", "04")}
                            </span>
                            <span className="ml-2 mt-0.5 flex min-w-0 flex-col">
                              <span className="text-xs font-semibold tracking-wide text-gray-500">
                                Closed
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
                          className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
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
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="mt-4 border-gray-200 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {getOptionsList().map((option) => {
                    return (
                      <div
                        className="py-2 sm:grid sm:grid-cols-3 sm:gap-4"
                        key={option.label}
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {option.label}
                        </dt>
                        {option?.link?.value ? (
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <a
                              className="link"
                              href={option.link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {option.link.label}
                            </a>
                          </dd>
                        ) : (
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {option.value}
                          </dd>
                        )}
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
