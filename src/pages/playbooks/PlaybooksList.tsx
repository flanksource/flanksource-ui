import { useGetAllPlaybookSpecs } from "@flanksource-ui/api/query-hooks/playbooks";
import ErrorPage from "@flanksource-ui/components/Errors/ErrorPage";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { playbookRunsPageTabs } from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecsList from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecsList";
import PlaybookSpecFormModal from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecFormModal";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
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
              <BreadcrumbRoot key={"playbook-root-item"} link="/playbooks">
                <FaHome className="text-black" />
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
        <PlaybookSpecFormModal
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
