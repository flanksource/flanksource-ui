import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
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
          <Dialog.Panel className="w-3/6 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              <div className="flex pointer-events-none sm:pointer-events-auto justify-between">
                <div className="flex-shrink-0">
                  <div className="rounded-full overflow-hidden flex justify-center items-center leading-none w-6 h-6 text-xs bg-lighter-gray">
                    {responder?.icon && <responder.icon className="w-7 h-7" />}
                  </div>
                </div>
                <div className="min-w-0 flex-1 ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    <a href="#" className="hover:underline">
                      {responder?.type}
                    </a>
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
            <div className="mt-4">
              <div className="border-gray-200 sm:p-0 mt-2">
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
