import { XIcon } from "@heroicons/react/solid";
import toast, { ToastBar, Toaster } from "react-hot-toast";

export function ToasterWithCloseButton() {
  return (
    <Toaster position="top-right" reverseOrder={false}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <button title="Dismiss" onClick={() => toast.dismiss(t.id)}>
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
