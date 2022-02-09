import React from "react";
import { Icon } from "../../../Icon";

export const HypothesisRowHeader = ({ title }) => (
  <div className="flex align-baseline text-sm font-medium my-2.5">
    <p className="text-dark-gray mr-2.5 mt-0.5 font-medium">{title}</p>
    <button type="button" className="bg-dark-blue rounded-full p-2">
      <Icon name="addButton" className="w-2.5 h-2.5" />
    </button>
  </div>
);
