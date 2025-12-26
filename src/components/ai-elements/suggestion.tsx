"use client";

import { Button } from "@flanksource-ui/components/ui/button";
import { cn } from "@flanksource-ui/lib/utils";
import type { ComponentProps } from "react";

export type SuggestionsProps = ComponentProps<"div">;

export const Suggestions = ({ className, ...props }: SuggestionsProps) => (
  <div
    className={cn("flex flex-wrap justify-center gap-2", className)}
    {...props}
  />
);

export type SuggestionProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick"
> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  ...props
}: SuggestionProps) => (
  <Button
    className={cn(
      "h-auto whitespace-normal rounded-full px-3 py-1.5 text-xs font-normal",
      className
    )}
    onClick={() => onClick?.(suggestion)}
    size="sm"
    type="button"
    variant="outline"
    {...props}
  >
    {suggestion}
  </Button>
);
