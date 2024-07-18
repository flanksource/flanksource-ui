import React from "react";
import { GetName } from "./data";
import { Title, StatusList } from "./renderers";
import { HealthCheck } from "../../api/types/health";

type CanaryCardProps = {
  checks: HealthCheck[];
  onClick: (check: HealthCheck) => void;
};

export function CanaryCards({ checks, onClick }: CanaryCardProps) {
  return (
    <ul className={`mt-1 grid grid-cols-1 gap-1 sm:gap-2`}>
      {checks.map((check) => (
        <li
          key={check.id}
          className="col-span-1 flex rounded-md rounded-l-md border-b border-l border-t border-gray-200 shadow-sm"
        >
          <button
            type="button"
            className="flex flex-1 cursor-pointer items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white pl-3 text-left"
            onClick={() => onClick(check)}
          >
            <div className="flex-1 py-2 text-sm">
              <span className="truncate font-medium text-gray-900 hover:text-gray-600">
                <Title title={GetName(check)} icon={check.icon || check.type} />
              </span>
              <div className="float-right mr-2">
                <StatusList check={check} />
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
