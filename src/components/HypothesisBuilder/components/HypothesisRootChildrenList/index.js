import React from "react";
import clsx from "clsx";
import { HypothesisBlockHeader } from "../HypothesisBlockHeader";
import { HypothesisBar } from "../HypothesisBar";

export const HypothesisRootChildrenList = ({ node, onTitleClick }) => (
  <>
    <HypothesisBlockHeader
      title="Issues"
      noResults={!node.children.length}
      noResultsTitle="No issues created yet"
      onButtonClock={() => {}}
      className="mb-2.5"
    />
    {node.children.map((item, index) => (
      <div key={item.id} className={clsx(index !== 0 && "mt-5")}>
        <HypothesisBar hypothesis={item} onTitleClick={onTitleClick} />
        <div className="ml-7">
          <div>
            <HypothesisBlockHeader
              title="Potential Solution"
              noResults={!item.children.length}
              noResultsTitle="No potential solutions created yet"
              onButtonClock={() => {}}
              className="my-2.5"
            />
            {item.children.map((item) => (
              <div key={item.id} className="flex flex-col mb-0.5">
                <HypothesisBar hypothesis={item} onTitleClick={onTitleClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </>
);
