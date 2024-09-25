import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getAgentByIDs } from "../../api/services/agents";
import { HealthCheck } from "../../api/types/health";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";

const defaultTabs = {
  all: {
    key: "all",
    value: "all",
    label: "All"
  }
};

// filter checks according to the 'tabBy' and selected tab
export function filterChecksByTabSelection(
  tabBy: string,
  selectedTab: string,
  checks: HealthCheck[]
) {
  if (
    checks == null ||
    (checks &&
      Object.keys(checks).length === 0 &&
      Object.getPrototypeOf(checks) === Object.prototype)
  ) {
    return checks;
  }
  let filteredChecks = checks;
  if (selectedTab !== "all") {
    if (tabBy === "namespace") {
      // if filter by namespace, show only selected namespace
      filteredChecks = checks.filter((o) => o.namespace === selectedTab);
    } else if (tabBy === "agent_id") {
      // if filter by agent_id, show only selected agent_id
      filteredChecks = checks.filter((o) => o.agent_id === selectedTab);
    } else {
      // filtered by non-boolean labels
      filteredChecks = checks.filter(
        (o) =>
          Object.prototype.hasOwnProperty.call(o.labels, tabBy) &&
          o.labels[tabBy] === selectedTab
      );
    }
  }
  return filteredChecks;
}

export function generateTabs(tabBy: string, checks: HealthCheck[]) {
  if (checks == null) {
    return defaultTabs;
  }
  let tabs = defaultTabs;
  if (tabBy === "namespace") {
    const namespaces = [...new Set(checks.map((o) => o.namespace || "none"))];
    tabs = {
      ...tabs,
      ...namespaces.reduce(
        (acc, namespace) => ({
          ...acc,
          [namespace]: {
            key: namespace,
            value: namespace,
            label: namespace
          }
        }),
        {}
      )
    };
  } else {
    // generate tabs by non boolean label
    const label = tabBy;
    const matchingLabelValues = checks.reduce((acc, o) => {
      if (o.labels == null) {
        return acc;
      }
      const labelKeys = Object.keys(o.labels);
      if (labelKeys.length > 0 && labelKeys.includes(label)) {
        acc = { ...acc, [o.labels[label]]: null };
      }
      return acc;
    }, {});
    tabs = {
      ...tabs,
      ...Object.keys(matchingLabelValues).reduce(
        (acc, labelValue) => ({
          ...acc,
          [labelValue]: {
            key: labelValue,
            value: labelValue,
            label: labelValue
          }
        }),
        {}
      )
    };
  }
  return tabs;
}

type CanaryTabsProps = {
  checks: HealthCheck[];
  tabBy: string;
  setTabSelection: (tab: string) => void;
  children: React.ReactNode;
};

export function CanaryTabs({
  checks,
  tabBy,
  children,
  setTabSelection
}: CanaryTabsProps) {
  const agentIDs = useMemo(() => {
    const uniqueIds = new Set(
      checks.filter((check) => check.agent_id).map((check) => check.agent_id)
    );
    return Array.from(uniqueIds) as string[];
  }, [checks]);

  const { data: agents = [] } = useQuery(
    ["db", "agents", ...agentIDs],
    () => getAgentByIDs(agentIDs),
    {
      enabled: tabBy === "agent_id" && agentIDs.length > 0
    }
  );

  const tabs = useMemo(() => {
    if (tabBy === "agent_id") {
      const tabs = agents.reduce(
        (acc, agent) => ({
          ...acc,
          [agent.name]: {
            key: agent.name,
            value: agent.id,
            label: agent.name
          }
        }),
        {}
      );
      return { ...defaultTabs, ...tabs };
    }
    return generateTabs(tabBy, checks);
  }, [agents, checks, tabBy]);

  const [selectedTab, setSelectedTab] = useState(Object.values(tabs)[0].value);

  // checking if previously selected tab still exists in newly-generated tabs
  useEffect(() => {
    // if it doesnt exist, reset to the first tab value
    if (
      !Object.entries(tabs).find(([key, value]) => value.value === selectedTab)
    ) {
      setSelectedTab(Object.values(tabs)[0].value);
    }
  }, [tabs, selectedTab]);

  const sortedTabs = useMemo(
    () =>
      Object.values(tabs).sort((v1, v2) => {
        // all tab comes, first, followed by the rest in alphabetical order
        if (v1.label.toLowerCase() === "all") {
          return -1;
        }
        if (v2.label.toLowerCase() === "all") {
          return 1;
        }
        return v1.label.localeCompare(v2.label);
      }),
    [tabs]
  );

  return (
    <Tabs
      activeTab={selectedTab}
      onSelectTab={(tab) => {
        setSelectedTab(tab);
        setTabSelection(tab);
      }}
    >
      {sortedTabs.map((item) => {
        return (
          <Tab key={item.label} label={item.label} value={item.value}>
            {children}
          </Tab>
        );
      })}
    </Tabs>
  );
}
