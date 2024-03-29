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
    <ul className={`mt-1 grid grid-cols-1 gap-1 sm:gap-2 `}>
      {checks.map((check) => (
        <li
          key={check.id}
          className="col-span-1 flex shadow-sm rounded-md  rounded-l-md border-l border-t border-b border-gray-200 "
        >
          <button
            type="button"
            className="text-left flex-1 flex pl-3 items-center cursor-pointer justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate  "
            onClick={() => onClick(check)}
          >
            <div className="flex-1 py-2 text-sm ">
              <span className="text-gray-900 font-medium hover:text-gray-600 truncate">
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
