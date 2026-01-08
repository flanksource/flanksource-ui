import { Search } from "lucide-react";
import { lazy, Suspense, useState } from "react";

const LazyResourceSelectorSearchModal = lazy(() =>
  import(
    "../../components/ResourceSelectorSearch/ResourceSelectorSearchModal"
  ).then((module) => ({
    default: module.ResourceSelectorSearchModal
  }))
);

export function ResourceSelectorSearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
        title="Resource Selector Search"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="sr-only">Resource Selector Search</span>
      </button>
      {open && (
        <Suspense fallback={null}>
          <LazyResourceSelectorSearchModal
            open={open}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
