import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useGetAllPlaybookSpecs } from "../../api/query-hooks/playbooks";
import ErrorPage from "../../components/Errors/ErrorPage";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecsForm from "../../components/Playbooks/Settings/PlaybookSpecsForm";
import PlaybookSpecsList from "../../components/Playbooks/Settings/PlaybookSpecsList";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import TabbedLinks from "../../ui/Tabs/TabbedLinks";

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
              <AuthorizationAccessCheck
                resource={tables.playbooks}
                action="write"
                key="add-playbook"
              >
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
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="flex flex-col p-0 h-full"
        loading={isLoading}
      >
        <TabbedLinks tabLinks={playbookRunsPageTabs}>
          <div className="flex h-full w-full flex-1 flex-col overflow-y-auto px-6">
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
