// ABOUTME: Custom react-joyride tooltip rendered with the app's design system.
// ABOUTME: Shows the step title, body, progress and Back/Next controls per step.buttons.
import { IoClose } from "react-icons/io5";
import { type TooltipRenderProps } from "react-joyride";
import { Button } from "../../ui/Buttons/Button";

export function TourTooltip({
  backProps,
  closeProps,
  primaryProps,
  index,
  isLastStep,
  size,
  step,
  tooltipProps
}: TooltipRenderProps) {
  const buttons = step.buttons ?? [];
  const showBack = buttons.includes("back");
  const showPrimary = buttons.includes("primary");

  return (
    <div
      {...tooltipProps}
      className="relative flex w-80 flex-col gap-3 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <button
        {...closeProps}
        className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <IoClose className="h-4 w-4" />
      </button>

      {step.title && (
        <h3 className="pr-6 text-base font-semibold text-gray-800">
          {step.title}
        </h3>
      )}

      <div className="text-sm leading-relaxed text-gray-600">
        {step.content}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gray-400">
          {index + 1} / {size}
        </span>
        <div className="flex items-center gap-2">
          {showBack && (
            <Button {...backProps} className="btn-white" size="sm">
              Back
            </Button>
          )}
          {showPrimary && (
            <Button {...primaryProps} className="btn-primary" size="sm">
              {isLastStep ? "Done" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
