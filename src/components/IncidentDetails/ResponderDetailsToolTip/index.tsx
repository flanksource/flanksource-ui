import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { formPropKey, ResponderPropsKeyToLabelMap } from "../AddResponder";

type ResponderDetailsToolTipProps = {
  element: React.ReactElement;
  data?: { [key: string]: string | undefined };
  responder: any;
} & React.HTMLProps<HTMLDivElement>;

export const ResponderDetailsToolTip = ({
  element,
  className,
  data,
  responder
}: ResponderDetailsToolTipProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const timerRef = useRef<any>();

  const onMouseOver = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowDropdown(true);
    }, 1000);
  };

  const onMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
  };

  const getOrderedKeys = (): formPropKey[] => {
    switch (responder.type) {
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

  const openLinkInNewTab = (link: string) => {
    window.open(link);
  };

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowDropdown(false);
      });
    };
    document.body.addEventListener("click", listener, true);
    return () => {
      document.body.removeEventListener("click", listener, true);
    };
  }, []);

  return (
    <div
      className={clsx("relative inline-block text-left", className)}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onMouseOut={onMouseLeave}
    >
      {element}
      <div
        className={clsx(
          "absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
          showDropdown ? "inline-block" : "hidden"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onMouseOut={onMouseLeave}
        style={{
          left: "calc(-200% - 35px)",
          top: "-5px"
        }}
      >
        <div className="py-1" role="none">
          <div className="bg-white px-2 py-2">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                {responder?.icon && (
                  <responder.icon className="w-6 h-6 align-sub" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span>{responder?.type}</span>
                  {responder?.json?.properties?.url && (
                    <FiExternalLink
                      className="float-right w-5 h-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openLinkInNewTab(responder?.json?.properties?.url);
                      }}
                    />
                  )}
                </p>
              </div>
            </div>
            <div className="border-gray-200 sm:p-0 mt-2">
              <dl className="sm:divide-y sm:divide-gray-200">
                {getOptionsList().map((option) => {
                  return (
                    <div
                      className="sm:grid sm:grid-cols-3 sm:gap-4 py-1"
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
        </div>
      </div>
    </div>
  );
};
