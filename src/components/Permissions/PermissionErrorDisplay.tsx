import { MdError } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@flanksource-ui/ui/Buttons/Button";

// Known permission error types
const SCOPE_EXPANSION_ERRORS = {
  ErrScopeExpansionInvalidObjectSelector:
    "ErrScopeExpansionInvalidObjectSelector",
  ErrScopeExpansionScopeNotFound: "ErrScopeExpansionScopeNotFound",
  ErrScopeExpansionInvalidScopeTargets: "ErrScopeExpansionInvalidScopeTargets"
} as const;

interface ParsedError {
  type: string;
  message: string;
  scope?: string;
}

/**
 * Parse permission errors and return a human-readable message
 * Known errors start with "ErrScopeExpansion" prefix
 * Format: ErrorType:additional-info
 */
export function parsePermissionError(error: string): ParsedError {
  if (!error) {
    return { type: "unknown", message: "Unknown error" };
  }

  // Check if it's a known scope expansion error
  if (error.startsWith("ErrScopeExpansion")) {
    const [errorType, ...rest] = error.split(":");
    const additionalInfo = rest.join(":");

    switch (errorType) {
      case SCOPE_EXPANSION_ERRORS.ErrScopeExpansionScopeNotFound:
        return {
          type: "scope-not-found",
          message: "Scope not found",
          scope: additionalInfo
        };
      case SCOPE_EXPANSION_ERRORS.ErrScopeExpansionInvalidObjectSelector:
        return {
          type: "invalid-object-selector",
          message: "Invalid object selector",
          scope: additionalInfo
        };
      case SCOPE_EXPANSION_ERRORS.ErrScopeExpansionInvalidScopeTargets:
        return {
          type: "invalid-scope-targets",
          message: "Invalid scope targets",
          scope: additionalInfo
        };
      default:
        return {
          type: "scope-expansion-error",
          message: error
        };
    }
  }

  // Unknown error - return as is
  return {
    type: "unknown",
    message: error
  };
}

export function PermissionErrorDisplay({
  error,
  showRecheckButton = false,
  onRecheck,
  isRechecking = false
}: {
  error?: string;
  showRecheckButton?: boolean;
  onRecheck?: () => void;
  isRechecking?: boolean;
}) {
  if (!error) {
    return null;
  }

  const parsedError = parsePermissionError(error);

  return (
    <div className="flex flex-row items-center gap-2 border-l-2 border-red-500 bg-red-50 px-3 py-2">
      <MdError className="h-5 w-5 flex-shrink-0 text-red-500" />
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-semibold text-red-600">
          {parsedError.message}
        </span>
        {parsedError.scope && (
          <span className="font-mono text-xs text-gray-600">
            {parsedError.scope}
          </span>
        )}
      </div>
      {showRecheckButton && onRecheck && (
        <>
          <Button
            type="button"
            text={isRechecking ? "Checking..." : "Re-check"}
            className="btn-sm border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200"
            onClick={onRecheck}
            icon={
              isRechecking ? <FaSpinner className="animate-spin" /> : undefined
            }
            disabled={isRechecking}
          />
          <span className="text-xs text-gray-600">
            Re-evaluates this permission to check if the error has been resolved
          </span>
        </>
      )}
    </div>
  );
}
