// ABOUTME: React context for bulk health check run state.
// ABOUTME: Shares selection mode and selected check IDs between toolbar and table.

import { createContext, useContext } from "react";

export type BulkCheckRunContextType = {
  isBulkRunMode: boolean;
  selectedCheckIds: Set<string>;
  toggleCheck: (id: string) => void;
  toggleChecks: (ids: string[], selected: boolean) => void;
  enterBulkMode: () => void;
  exitBulkMode: () => void;
};

const BulkCheckRunContext = createContext<BulkCheckRunContextType>({
  isBulkRunMode: false,
  selectedCheckIds: new Set(),
  toggleCheck: () => {},
  toggleChecks: () => {},
  enterBulkMode: () => {},
  exitBulkMode: () => {}
});

export const useBulkCheckRun = () => useContext(BulkCheckRunContext);

export default BulkCheckRunContext;
