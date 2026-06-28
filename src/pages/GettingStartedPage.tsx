// ABOUTME: The "Getting started" checklist page, grouped by feature category.
// ABOUTME: Ticks items the user has completed and launches section or single-item tours.
import { type ReactNode } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { VscJson } from "react-icons/vsc";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import {
  useCanRunPlaybooks,
  useStartTour,
  useStartTourSection,
  useStartTouchpoint
} from "@flanksource-ui/components/GuidedTour/guidedTourState";
import {
  touchpointCategories,
  type TouchpointCategory
} from "@flanksource-ui/components/GuidedTour/touchpoints";
import { useCompletedTouchpoints } from "@flanksource-ui/components/GuidedTour/useTouchpoints";

const iconClass = "h-5 w-5 shrink-0 text-gray-500";

const categoryIcons: Record<TouchpointCategory["id"], ReactNode> = {
  health: <AiFillHeart className={iconClass} />,
  catalog: <VscJson className={iconClass} />,
  playbooks: <Icon name="playbook" className={iconClass} />,
  views: <Icon name="workflow" className={iconClass} />
};

function CategoryCard({
  category,
  completed,
  onStartCategory,
  onStartItem
}: {
  category: TouchpointCategory;
  completed: Set<string>;
  onStartCategory: () => void;
  onStartItem: (id: string) => void;
}) {
  const doneCount = category.items.filter((item) =>
    completed.has(item.id)
  ).length;
  const progress = Math.round((doneCount / category.items.length) * 100);

  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        {categoryIcons[category.id]}
        <button
          type="button"
          onClick={onStartCategory}
          className="text-left text-base font-semibold text-gray-800 hover:text-blue-600"
          title={`Take the ${category.title.toLowerCase()} tour`}
        >
          {category.title}
        </button>
        <span className="ml-auto text-xs text-gray-400">
          {doneCount}/{category.items.length}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-100">
        <div
          className="h-1 bg-green-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="flex flex-col">
        {category.items.map((item) => {
          const isDone = completed.has(item.id);
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 last:border-b-0"
            >
              {isDone ? (
                <FaCircleCheck className="h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <FaRegCircle className="h-4 w-4 shrink-0 text-gray-300" />
              )}
              <span
                className={`text-sm ${
                  isDone ? "text-gray-400 line-through" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
              <button
                type="button"
                onClick={() => onStartItem(item.id)}
                className="ml-auto rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50"
              >
                {isDone ? "Replay" : "Show me"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function GettingStartedPage() {
  const { data: completed } = useCompletedTouchpoints();
  const canRunPlaybooks = useCanRunPlaybooks();
  const startSection = useStartTourSection();
  const startTouchpoint = useStartTouchpoint();
  const openTourMenu = useStartTour();

  const completedSet = completed ?? new Set<string>();
  const categories = touchpointCategories.filter(
    (category) => category.id !== "playbooks" || canRunPlaybooks
  );

  return (
    <>
      <Head prefix="Getting started" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="getting-started" link="/getting-started">
                Getting started
              </BreadcrumbRoot>
            ]}
          />
        }
        extra={
          <button type="button" onClick={openTourMenu} className="btn-primary">
            Take a guided tour
          </button>
        }
        contentClass="p-0 h-full"
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-gray-800">
                Get the most out of Mission Control
              </h1>
              <p className="text-sm text-gray-500">
                Work through this checklist to learn how to monitor resources,
                explore the catalog, run playbooks and build custom views. Each
                item ticks off as you try it — click “Show me” for a guided walk
                through.
              </p>
            </div>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                completed={completedSet}
                onStartCategory={() => startSection(category.id)}
                onStartItem={startTouchpoint}
              />
            ))}
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
