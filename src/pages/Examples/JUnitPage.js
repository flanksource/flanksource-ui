import React from "react";
import { MinimalLayout } from "../../components/Layout";
import jUnitData from "../../data/jUnit.json";
import { JUnit } from "../../components/JUnit";

export const JUnitPage = () => (
  <MinimalLayout>
    <JUnit
      suites={jUnitData.suites}
      duration={jUnitData.duration}
      failed={jUnitData.failed}
      passed={jUnitData.passed}
    />
  </MinimalLayout>
);
