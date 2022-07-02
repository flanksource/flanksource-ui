import React from "react";

export interface IItem {
  icon?: React.ReactNode;
  iconTitle?: React.ReactNode;
  description?: string;
  value: string | number | undefined | null;
}
