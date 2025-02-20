import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";

export function useFlanksourceUISnippet(
  user?: Record<string, any>,
  organization?: Record<string, any>
) {
  const [isSnippetExecuted, setIsSnippetExecuted] = useState(false);

  const { featureFlags, featureFlagsLoaded } = useFeatureFlagsContext();

  useEffect(() => {
    if (!featureFlagsLoaded || isSnippetExecuted) {
      return;
    }

    const get = (name: string, val: any) => {
      var item = (featureFlags ?? []).find((flag) => flag.name === name);
      if (item == null) {
        return val;
      }
      if (val instanceof Number) {
        return parseFloat(item.value);
      } else if (val instanceof Boolean || typeof val == "boolean") {
        return item.value === "true";
      }
      return item.value;
    };

    if (isSnippetExecuted || !featureFlags) {
      return;
    }
    const snippets = (featureFlags ?? []).find((flag) => {
      return flag.name === "flanksource.ui.snippets" && flag.source === "local";
    });

    const sentryEnabled = get("flanksource.ui.sentry.enabled", true);
    const replayIntegration = get(
      "flanksource.ui.sentry.replay.enabled",
      false
    );
    const replaySampleRate = get(
      "flanksource.ui.sentry.traces.replay.sampleRate",
      0.1
    );
    const tracesSampleRate = get("flanksource.ui.sentry.traces.sampleRate", 1);
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (sentryEnabled) {
      var integrations = [];

      if (replayIntegration) {
        integrations.push(Sentry.replayIntegration());
      }

      Sentry.init({
        dsn: dsn,
        integrations: integrations,
        tunnel: "/monitoring",

        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: tracesSampleRate,

        // Define how likely Replay events are sampled.
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: replaySampleRate,

        // Define how likely Replay events are sampled when an error occurs.
        replaysOnErrorSampleRate: 1.0,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: get("flanksource.ui.sentry.debug", false)
      });
      Sentry.setUser({
        email: user?.email,
        name: user?.name,
        org: organization?.name
      });
      console.info("Sentry enabled");
    } else {
      console.info("Sentry disabled");
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
        Sentry.captureException(error, {
          extra: {
            snippet: snippets.value
          }
        });
      }
    } else if (user) {
      setIsSnippetExecuted(true);
    }
  }, [featureFlags, featureFlagsLoaded, user, organization, isSnippetExecuted]);
  return null;
}
