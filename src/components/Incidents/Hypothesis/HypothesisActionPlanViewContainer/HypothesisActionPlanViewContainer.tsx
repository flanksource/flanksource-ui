import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

type HypothesisActionPlanViewContainerProps = {
  contentClass?: string;
} & React.HTMLProps<HTMLDivElement>;

export function HypothesisActionPlanViewContainer({
  children,
  contentClass,
  ...rest
}: HypothesisActionPlanViewContainerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const showAllComments = searchParams.get("comments") === "true";
  const toggleComment = () => {
    const newParams = new URLSearchParams(
      showAllComments ? {} : { comments: "true" }
    );
    setSearchParams(newParams);
  };
  const clientHeight = window.document.body.clientHeight;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    const data = contentRef.current.getBoundingClientRect();
    const totalHeight = clientHeight;
    const marginBottom = 40;
    const height = `${totalHeight - data.top - marginBottom}px`;
    contentRef.current.style.setProperty("height", height);
  });

  return (
    <div {...rest}>
      <div className="mb-5 flex items-center justify-end px-4 text-base font-semibold">
        <div className="flex items-center">
          <div className="pr-4">
            {showAllComments ? "Collapse" : "Expand"} All
          </div>
          {/* @ts-ignore */}
          <Switch
            checked={true}
            onChange={toggleComment}
            className={clsx(
              showAllComments ? "bg-blue-900" : "bg-gray-200",
              "relative inline-flex h-[30px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            )}
          >
            <span className="sr-only">Show Comments</span>
            <span
              aria-hidden="true"
              className={clsx(
                showAllComments ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>
      </div>
      <div ref={contentRef} className={clsx(contentClass, "overflow-y-auto")}>
        {children}
      </div>
    </div>
  );
}
