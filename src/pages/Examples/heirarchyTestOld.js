import React, { useState } from "react";
import { HypothesisBuilder } from "../../components/HypothesisBuilder";

export function HeirarchyTestPageOld() {
  const [existing, setExisting] = useState(false);
  const [showOuptut, setShowOuptut] = useState(false);
  const [treeDraft, setTreeDraft] = useState(null);
  const [loadedTree, setLoadedTree] = useState(null);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        <div className="py-8 w-full">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              value={existing}
              onChange={(e) => {
                setExisting(e.target.checked);
                if (!e.target.checked) {
                  setTreeDraft(null);
                }
              }}
            />
            load existing tree
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              value={showOuptut}
              onChange={(e) => {
                setShowOuptut(e.target.checked);
              }}
            />
            show generated output
          </div>
          {existing && (
            <div className="mt-2 flex flex-col items-start w-full">
              <textarea
                className="w-full text-xs"
                onChange={(e) => setTreeDraft(e.target.value)}
                placeholder="must be valid parsable JSON"
              />
              <button
                type="button"
                className="border border-gray-700 py-1 px-2 mt-2"
                onClick={() => setLoadedTree(JSON.parse(treeDraft))}
              >
                Load
              </button>
            </div>
          )}
        </div>

        <HypothesisBuilder
          loadedTree={loadedTree}
          showGeneratedOutput={showOuptut}
        />
      </div>
    </div>
  );
}
