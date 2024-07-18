import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  ResponderOption,
  ResponderPropsKeyToLabelMap,
  getOrderedKeys,
  getResponderTitleByValue
} from "../AddResponders/AddResponder";

type ResponderDetailsToolTipProps = {
  element: React.ReactNode;
  data?: Record<string, any>;
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

  const getOptionsList = (responder: any) => {
    const keys = getOrderedKeys(responder);
    const options: ResponderOption[] = [];
    keys.forEach((key) => {
      options.push({
        label:
          ResponderPropsKeyToLabelMap[
            key as keyof typeof ResponderPropsKeyToLabelMap
          ],
        value: data?.[key],
        link: responder.properties.find(
          (v: ResponderOption) =>
            v.label ===
            ResponderPropsKeyToLabelMap[
              key as keyof typeof ResponderPropsKeyToLabelMap
            ]
        )?.link
      });
    });
    return options;
  };

  const openLinkInNewTab = (responder: any) => {
    const link = responder.properties.find(
      (v: ResponderOption) =>
        v.label === ResponderPropsKeyToLabelMap.external_id
    )?.link;
    if (!link) {
      return;
    }
    window.open(link.value);
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
          "absolute right-0 z-50 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          showDropdown ? "inline-block" : "hidden"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onMouseOut={onMouseLeave}
        style={{
          left: "calc(-100% - 60px)",
          top: "-10px"
        }}
      >
        <div className="py-1" role="none">
          <div className="bg-white px-2 py-2">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                {responder?.icon && (
                  <responder.icon className="h-6 w-6 align-sub" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span>{getResponderTitleByValue(responder?.type)}</span>
                  {responder?.json?.properties?.external_id && (
                    <FiExternalLink
                      className="float-right h-5 w-5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openLinkInNewTab(responder);
                      }}
                    />
                  )}
                </p>
              </div>
            </div>
            <div className="mt-2 border-gray-200 sm:p-0">
              <dl
                className="sm:divide-y sm:divide-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {getOptionsList(responder).map((option) => {
                  return (
                    <div
                      className="py-1 sm:grid sm:grid-cols-3 sm:gap-4"
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
        </div>
      </div>
    </div>
  );
};
