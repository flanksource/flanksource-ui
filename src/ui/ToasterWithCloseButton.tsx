import { XIcon } from "@heroicons/react/solid";
import toast, { resolveValue, ToastBar, Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

export function ToasterWithCloseButton() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 5000
      }}
    >
      {(t) => {
        const resolved = resolveValue(t.message, t);
        const textLen = typeof resolved === "string" ? resolved.length : 40;
        const widthClass =
          textLen > 200 ? "max-w-2xl" : textLen > 80 ? "max-w-lg" : "max-w-xs";

        return (
          <ToastBar toast={t}>
            {({ message }) => (
              <div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {t.type === "success" && (
                      <FaCheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {t.type === "error" && (
                      <IoCloseCircleSharp className="h-5 w-5 text-red-500" />
                    )}
                    {t.type === "loading" && (
                      <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                    )}
                  </div>

                  <div className={`ml-1 flex-1 ${widthClass}`}>
                    <p className="break-words text-sm font-medium text-gray-900">
                      {resolveValue(message, t)}
                    </p>
                  </div>
                  {t.type !== "loading" && (
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          toast.dismiss(t.id);
                        }}
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Close</span>
                        <XIcon aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ToastBar>
        );
      }}
    </Toaster>
  );
}
