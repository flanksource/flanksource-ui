import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getAgentByIDs, isLocalAgent } from "../../api/services/agents";
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
      // "local" is a special tab for checks without an agent
      if (selectedTab === "local") {
        filteredChecks = checks.filter((o) => isLocalAgent(o.agent_id));
      } else {
        filteredChecks = checks.filter((o) => o.agent_id === selectedTab);
      }
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
  // Collect unique non-local agent IDs and any names available from check data
  const { agentIDsToFetch, knownAgents } = useMemo(() => {
    const names = new Map<string, string>();
    checks.forEach((check) => {
      const id = check.agent_id;
      if (id && !isLocalAgent(id) && !names.has(id)) {
        names.set(id, check.agents?.name || "");
      }
    });
    // Only fetch agents where we don't already have a name
    const toFetch = Array.from(names.entries())
      .filter(([, name]) => !name)
      .map(([id]) => id);
    return { agentIDsToFetch: toFetch, knownAgents: names };
  }, [checks]);

  const { data: fetchedAgents = [] } = useQuery(
    ["db", "agents", ...agentIDsToFetch],
    () => getAgentByIDs(agentIDsToFetch),
    {
      enabled: tabBy === "agent_id" && agentIDsToFetch.length > 0
    }
  );

  const tabs = useMemo(() => {
    if (tabBy === "agent_id") {
      // Merge fetched names into known agents
      const agentMap = new Map(knownAgents);
      fetchedAgents.forEach((agent) => {
        if (!isLocalAgent(agent.id)) {
          agentMap.set(agent.id, agent.name);
        }
      });

      const agentTabs = {} as Record<
        string,
        { key: string; value: string; label: string }
      >;
      agentMap.forEach((name, id) => {
        const label = name || id;
        agentTabs[label] = { key: label, value: id, label };
      });

      // Add "local" tab for checks without an agent
      const hasLocalChecks = checks.some((check) =>
        isLocalAgent(check.agent_id)
      );
      if (hasLocalChecks) {
        agentTabs["local"] = {
          key: "local",
          value: "local",
          label: "local"
        };
      }
      return { ...defaultTabs, ...agentTabs };
    }
    return generateTabs(tabBy, checks);
  }, [knownAgents, fetchedAgents, checks, tabBy]);

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
