import clsx from "clsx";

type FlatTabsProps<T extends string> = {
  tabs: {
    label: string;
    key: T;
    current: boolean;
    content: React.ReactNode;
  }[];
  activeTab: string;
  setActiveTab: (tab: T) => void;
};

export default function FlatTabs<T extends string>({
  tabs,
  activeTab,
  setActiveTab
}: FlatTabsProps<T>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          defaultValue={activeTab}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        >
          {tabs.map((tab) => (
            <option key={tab.label}>{tab.label}</option>
          ))}
        </select>
      </div>
      <div className="hidden flex-1 flex-col sm:flex">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key)}
                aria-current={tab.current ? "page" : undefined}
                className={clsx(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 px-2 py-4 text-sm font-medium"
                )}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {tabs.find((tab) => tab.current)?.content}
      </div>
    </div>
  );
}
