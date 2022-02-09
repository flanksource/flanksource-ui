import React from "react";
import clsx from "clsx";
import { HypothesisRowHeader } from "./HypothesisRowHeader";
import { HypothesisRow } from "./HypothesisRow";

export const HypothesisList = ({ node, statusColorClass, enumsStatus }) => (
  <>
    <HypothesisRowHeader title="Issues" />
    {node.children.map((item, index) => (
      <div key={item.id} className={clsx(index !== 0 && "mt-5")}>
        <HypothesisRow
          iconLeftClassName={statusColorClass(item.status)}
          iconLeft={enumsStatus(item.status).icon}
          text={item.title || "(none)"}
          showMessageIcon={item.comments.length > 0}
          showSignalIcon={item.evidence.length > 0}
          image={item.created_by.avatar}
        />
        <div className="ml-7">
          <div>
            {item.children && (
              <HypothesisRowHeader title="Potential Solution" />
            )}
            {item.children.map(
              ({
                id,
                title,
                status,
                created_by: createdBy,
                comments,
                evidence
              }) => (
                <div key={id} className="flex flex-col mb-0.5">
                  <HypothesisRow
                    iconLeftClassName={statusColorClass(status)}
                    iconLeft={enumsStatus(status).icon}
                    text={title || "(none)"}
                    showMessageIcon={comments.length > 0}
                    showSignalIcon={evidence.length > 0}
                    image={createdBy.avatar}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ))}
  </>
);
