import React from "react";
import { UserCircle } from "lucide-react";
import DataTable from "../DataTable";
import AuthCard from "../AuthCard";
import { formatDate } from "../../utils";
import { AccessControl } from "../../types";

interface AccessControlProps {
  accessControl: AccessControl;
}

const userColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Role", accessor: "role" },
  // {
  //   header: "Auth Type",
  //   accessor: "email",
  //   render: (value: string, ) => {
  //     const auth = application.accessControl.authentication?.find((a) =>
  //       user.email.endsWith(a.domain || "")
  //     );
  //     return auth ? auth.type.toUpperCase() : "N/A";
  //   }
  // },
  {
    header: "Created",
    accessor: "created",
    render: (value: string) => formatDate(value)
  },
  {
    header: "Last Login",
    accessor: "lastLogin",
    render: (value: string) => formatDate(value)
  },
  {
    header: "Last Access Review",
    accessor: "lastAccessReview",
    render: (value: string) => formatDate(value)
  }
];

const ApplicationAccessControl: React.FC<AccessControlProps> = ({
  accessControl
}) => {
  return (
    <>
      <div>
        <h3 className="mb-4 flex items-center text-xl font-semibold">
          <UserCircle className="mr-2 text-teal-600" size={20} />
          Users & Roles
        </h3>

        <div className="space-y-6">
          <DataTable columns={userColumns} data={accessControl.users || []} />

          {accessControl.authentication && (
            <div>
              <h4 className="mb-3 text-lg font-medium">
                Authentication Methods
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {accessControl.authentication
                  ?.slice(0, 3)
                  .map((auth) => <AuthCard key={auth.name} auth={auth} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="border-gray-200" />
    </>
  );
};

export default ApplicationAccessControl;
