import { Head } from "../../../ui/Head";
import { Icon } from "../../../ui/Icons/Icon";
import { SearchLayout } from "../../../ui/Layout/SearchLayout";
import { BreadcrumbNav, BreadcrumbRoot } from "../../../ui/BreadcrumbNav";

interface ViewLayoutProps {
  title: string;
  icon: string;
  onRefresh: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;
  centered?: boolean;
}

const ViewLayout: React.FC<ViewLayoutProps> = ({
  title,
  icon,
  onRefresh,
  loading,
  extra,
  children,
  centered = false
}) => (
  <>
    <Head prefix={title} />
    <SearchLayout
      title={
        <BreadcrumbNav
          list={[
            <BreadcrumbRoot key={"view"} link="/views">
              <Icon name={icon} className="mr-2 h-4 w-4" />
              {title}
            </BreadcrumbRoot>
          ]}
        />
      }
      onRefresh={onRefresh}
      contentClass="p-0 h-full"
      loading={loading}
      extra={extra}
    >
      {centered ? (
        <div className="flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : (
        children
      )}
    </SearchLayout>
  </>
);

export default ViewLayout;
