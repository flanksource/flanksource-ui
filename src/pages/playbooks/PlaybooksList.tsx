import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useGetAllPlaybookSpecs } from "../../api/query-hooks/playbooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import ErrorPage from "../../components/Errors/ErrorPage";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecsForm from "../../components/Playbooks/Settings/PlaybookSpecsForm";
import PlaybookSpecsList from "../../components/Playbooks/Settings/PlaybookSpecsList";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

export function PlaybooksListPage() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading,
    error,
    data: playbooks,
    refetch
  } = useGetAllPlaybookSpecs();

  return (
    <>
      <Head prefix="Playbook" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                key={"playbook-root-item"}
                link="/settings/connections"
              >
                Playbook
              </BreadcrumbRoot>,
              <button
                key={"playbook-add-item-button"}
                type="button"
                className=""
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="flex flex-col p-0 h-full"
        loading={isLoading}
      >
        <TabbedLinks tabLinks={playbookRunsPageTabs}>
          <div className="flex flex-col flex-1 px-6 h-full w-full">
            {error && !playbooks ? (
              <ErrorPage error={error} />
            ) : (
              <PlaybookSpecsList data={playbooks ?? []} refetch={refetch} />
            )}
          </div>
        </TabbedLinks>
        <PlaybookSpecsForm
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          refresh={refetch}
        />
      </SearchLayout>
    </>
  );
}
