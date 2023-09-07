import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useGetAllPlaybookSpecs } from "../../api/query-hooks/playbooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import ErrorPage from "../../components/Errors/ErrorPage";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import PlaybookSpecsForm from "../../components/Playbooks/Settings/PlaybookSpecsForm";
import PlaybookSpecsTable, {
  PlaybookSpec
} from "../../components/Playbooks/Settings/PlaybookSpecsTable";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

export function PlaybooksListPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<PlaybookSpec>();

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
              <BreadcrumbRoot link="/settings/connections">
                Playbook
              </BreadcrumbRoot>,
              <button
                type="button"
                className=""
                onClick={() => {
                  setIsOpen(true);
                  setEditedRow(undefined);
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
          <div className="flex flex-col flex-1 px-6 h-full max-w-screen-xl mx-auto">
            {error && !playbooks ? (
              <ErrorPage error={error} />
            ) : (
              <PlaybookSpecsTable
                data={playbooks ?? []}
                isLoading={isLoading}
                onRowClick={(val) => {
                  setIsOpen(true);
                  setEditedRow(val);
                }}
              />
            )}
          </div>
        </TabbedLinks>
        <PlaybookSpecsForm
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setEditedRow(undefined);
          }}
          playbook={editedRow}
          refresh={refetch}
        />
      </SearchLayout>
    </>
  );
}
