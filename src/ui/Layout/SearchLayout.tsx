import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { Sparkles } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { cardPreferenceAtom } from "@flanksource-ui/store/preference.state";

import { HelpDropdown } from "../MenuBar/HelpDropdown";
import { RefreshButton } from "../Buttons/RefreshButton";
import { UserProfileDropdown } from "../../components/Users/UserProfile";
import DashboardErrorBoundary from "../../components/Errors/DashboardErrorBoundary";
import PreferencePopOver from "./Preference";
import { AiFeatureLoaderProvider, useAiFeatureLoader } from "./AiFeatureLoader";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { features } from "../../services/permissions/features";
import { ResourceSelectorSearchButton } from "./SearchLayoutResourceSearch";

// Lazy load AI chat components to avoid bundling AI SDK until first use
const LazyAiChatProvider = lazy(() =>
  import("./SearchLayoutAiChat").then((module) => ({
    default: module.AiChatSection
  }))
);

const LazyAiChatButton = lazy(() =>
  import("./SearchLayoutAiChat").then((module) => ({
    default: module.AiChatButton
  }))
);

interface IProps {
  children: React.ReactNode;
  contentClass?: string;
  title?: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
  extraClassName?: string;
}

function SearchLayoutInner({
  children,
  contentClass,
  extraClassName = "",
  title,
  extra,
  loading,
  onRefresh
}: IProps) {
  const [topologyCardSize, setTopologyCardSize] = useAtom(cardPreferenceAtom);
  const { requestAiFeatures, aiLoaded } = useAiFeatureLoader();
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const { isFeatureDisabled } = useFeatureFlagsContext();
  const isAiDisabled = isFeatureDisabled(features.ai);

  const handleAiButtonClick = () => {
    if (!aiLoaded) {
      requestAiFeatures();
      setShouldAutoOpen(true);
    }
  };

  const content = (
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-hidden bg-gray-50">
      <div className="sticky top-0 z-20 flex h-12 flex-shrink-0 bg-white py-2 shadow">
        <div className="flex flex-1 justify-between px-4">
          <div className="flex items-center">
            <div>{title}</div>
          </div>
          <div
            className={`ml-4 flex items-center gap-3 md:ml-6 ${extraClassName}`}
          >
            {extra}
            <div className="flex h-8 items-center divide-x divide-gray-300 rounded-md border border-gray-300 bg-white">
              {onRefresh && (
                <div className="flex h-full w-8 items-center justify-center">
                  <RefreshButton onClick={onRefresh} animate={loading} />
                </div>
              )}
              <div className="flex h-full w-8 items-center justify-center">
                <PreferencePopOver
                  cardSize={topologyCardSize}
                  setTopologyCardSize={setTopologyCardSize}
                />
              </div>
            </div>

            <div className="flex h-8 items-center divide-x divide-gray-300 rounded-md border border-gray-300 bg-white">
              <ResourceSelectorSearchButton />
              {!isAiDisabled &&
                (aiLoaded ? (
                  <Suspense
                    fallback={
                      <button
                        type="button"
                        className="flex h-full w-8 items-center justify-center text-gray-400"
                        disabled
                      >
                        <Sparkles
                          className="h-4 w-4 animate-pulse"
                          aria-hidden
                        />
                      </button>
                    }
                  >
                    <LazyAiChatButton shouldAutoOpen={shouldAutoOpen} />
                  </Suspense>
                ) : (
                  <button
                    type="button"
                    className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
                    title="AI Chat"
                    onClick={handleAiButtonClick}
                  >
                    <Sparkles className="h-4 w-4" aria-hidden />
                    <span className="sr-only">AI Chat</span>
                  </button>
                ))}
              <Link
                to={{
                  pathname: "/notifications"
                }}
                className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
              >
                <FaBell className="h-4 w-4" />
              </Link>
              <div className="flex h-full w-8 items-center justify-center">
                <HelpDropdown />
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      <main className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <DashboardErrorBoundary>
          <div
            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${contentClass || "p-6"}`}
          >
            {children}
          </div>
        </DashboardErrorBoundary>
      </main>
    </div>
  );

  // Wrap everything in the AI provider when loaded so SendToAiButton can access context
  if (aiLoaded && !isAiDisabled) {
    return (
      <Suspense fallback={content}>
        <LazyAiChatProvider>{content}</LazyAiChatProvider>
      </Suspense>
    );
  }

  return content;
}

export function SearchLayout(props: IProps) {
  return (
    <AiFeatureLoaderProvider>
      <SearchLayoutInner {...props} />
    </AiFeatureLoaderProvider>
  );
}
