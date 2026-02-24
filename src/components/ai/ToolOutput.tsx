"use client";

import { CodeBlock } from "@flanksource-ui/components/ai-elements/code-block";
import type { ToolOutputProps as RegistryToolOutputProps } from "@flanksource-ui/components/ai-elements/tool";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { cn } from "@flanksource-ui/lib/utils";
import { AlertTriangleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import {
  isToolOutputTruncated,
  tryParseJSON,
  unwrapMCPEnvelope
} from "./mcp-utils";

export type ToolOutputProps = RegistryToolOutputProps;

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  // Unwrap MCP envelope if present, otherwise use raw output.
  const mcpText = unwrapMCPEnvelope(output);
  const resolved = mcpText ?? output;
  const truncated = isToolOutputTruncated(resolved);

  let Output = <div>{resolved as ReactNode}</div>;

  if (typeof resolved === "string") {
    const parsed = tryParseJSON(resolved);

    if (parsed !== null) {
      Output = (
        <CodeBlock code={JSON.stringify(parsed, null, 2)} language="json" />
      );
    } else {
      Output = (
        <pre className="whitespace-pre-wrap p-4 font-mono text-xs">
          {resolved}
        </pre>
      );
    }
  } else if (typeof resolved === "object" && !isValidElement(resolved)) {
    Output = (
      <CodeBlock code={JSON.stringify(resolved, null, 2)} language="json" />
    );
  }

  return (
    <div className={cn("space-y-2 p-4", className)} {...props}>
      <div className="flex items-center gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {errorText ? "Error" : "Result"}
        </h4>
        {truncated && (
          <Badge className="gap-1 rounded-full text-xs" variant="secondary">
            <AlertTriangleIcon className="size-3 text-yellow-600" />
            Output truncated
          </Badge>
        )}
      </div>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          errorText
            ? "bg-destructive/10 text-destructive"
            : "bg-muted/50 text-foreground"
        )}
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
