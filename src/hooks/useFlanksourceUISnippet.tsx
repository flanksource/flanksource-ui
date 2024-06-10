import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { useEffect, useState } from "react";

export function useFlanksourceUISnippet(
  user?: Record<string, any>,
  organization?: Record<string, any>
) {
  const [isSnippetExecuted, setIsSnippetExecuted] = useState(false);

  const { featureFlags } = useFeatureFlagsContext();

  useEffect(() => {
    if (isSnippetExecuted) {
      return;
    }
    const snippets = featureFlags?.find((flag) => {
      return flag.name === "flanksource.ui.snippets";
    });

    if (snippets?.source !== "local") {
      console.warn("UI snippets can only be set at start time.");
      return;
    }

    if (snippets && user) {
      try {
        // We need to wrap the snippet in a function to be able to pass in named
        // parameters to the snippet.
        const wrapFn = () => `{ return  ${snippets.value} };`;
        // eslint-disable-next-line no-new-func
        const func = new Function(wrapFn());
        // The first call to the function returns the actual snippet function. And
        // the second call to the function executes the snippet function.s
        func.call(null).call(null, { user, organization });
        setIsSnippetExecuted(true);
      } catch (error) {
        console.error("Error executing snippet", error);
      }
    }
  }, [featureFlags, user, organization, isSnippetExecuted]);

  return null;
}
