import {
  Fragment,
  useState,
  createContext,
  useContext,
  useEffect
} from "react";
import { Transition } from "@headlessui/react";
import { HiExclamation } from "react-icons/hi";
import { XIcon } from "@heroicons/react/solid";
import { findIndex, remove } from "lodash";

export const ToastContext = createContext(null);

export const ToastProvider = ({ toast, children }) => (
  <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
);

export const useToaster = () => useContext(ToastContext);

export function Toast() {
  const { toasts, setToasts } = useContext(ToastContext);

  const onRemove = (toast) => {
    const removed = remove(toasts, (t) => t.message === toast.message);
    setToasts(removed);
  };

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-9 mt-2 flex items-end px-2 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        {toasts &&
          toasts.map((toast) => (
            <div
              key={toast.message}
              className="w-full flex bottom-0 flex-col items-center space-y-4 sm:items-end z-50"
            >
              <Transition
                show={!toast.hide}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <HiExclamation
                          className="h-6 w-6 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          {toast.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {toast.message}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <button
                          className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {
                            onRemove(toast);
                          }}
                        >
                          <span className="sr-only">Close</span>
                          <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          ))}
      </div>
    </>
  );
}
