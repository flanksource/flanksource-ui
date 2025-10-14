import { render, screen } from "@testing-library/react";
import { Connection } from "../ConnectionFormModal";
import { ConnectionList } from "../ConnectionsList";

// Mock the CRDSource component
jest.mock("../../Settings/CRDSource", () => {
  return function MockCRDSource({
    source,
    id,
    showMinimal
  }: {
    source: string;
    id: string;
    showMinimal: boolean;
  }) {
    return (
      <div data-testid="crd-source">
        CRD (source: {source}, id: {id}, minimal: {showMinimal.toString()})
      </div>
    );
  };
});

// Mock MRTAvatarCell
jest.mock("../../../ui/MRTDataTable/Cells/MRTAvataCell", () => {
  return function MockMRTAvatarCell(props: any) {
    const user = props.row?.getValue(props.column?.id);
    return (
      <div data-testid="avatar-cell">
        Avatar: {user?.name || "No user"}
      </div>
    );
  };
});

// Mock other required dependencies
jest.mock("../../../ui/MRTDataTable/MRTDataTable", () => {
  return function MockMRTDataTable({
    columns,
    data
  }: {
    columns: any[];
    data: any[];
  }) {
    return (
      <div data-testid="mrt-table">
        {data.map((row, index) => (
          <div key={index} data-testid="table-row">
            {columns.map((column, colIndex) => (
              <div key={colIndex} data-testid={`cell-${column.header}`}>
                {column.Cell
                  ? column.Cell({
                      row: { original: row, getValue: (key: string) => row[key] },
                      column: { id: column.accessorKey }
                    })
                  : row[column.accessorKey]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
});

describe("ConnectionsList", () => {
  const mockConnectionWithCRD: Connection = {
    id: "conn-123",
    name: "Test CRD Connection",
    type: "postgres",
    source: "KubernetesCRD",
    created_by: { id: "user-1", name: "User One" }
  };

  const mockConnectionWithUser: Connection = {
    id: "conn-456",
    name: "Test User Connection",
    type: "mysql",
    created_by: { id: "user-2", name: "User Two" }
  };

  it("should display CRD component when source is KubernetesCRD", () => {
    render(
      <ConnectionList
        data={[mockConnectionWithCRD]}
        isLoading={false}
      />
    );

    expect(screen.getByTestId("crd-source")).toBeInTheDocument();
    expect(screen.getByText(/CRD \(source: KubernetesCRD/)).toBeInTheDocument();
  });

  it("should display avatar when source is not KubernetesCRD", () => {
    render(
      <ConnectionList
        data={[mockConnectionWithUser]}
        isLoading={false}
      />
    );

    expect(screen.getByTestId("avatar-cell")).toBeInTheDocument();
    expect(screen.queryByTestId("crd-source")).not.toBeInTheDocument();
  });

  it("should handle mixed data with both CRD and user sources", () => {
    render(
      <ConnectionList
        data={[mockConnectionWithCRD, mockConnectionWithUser]}
        isLoading={false}
      />
    );

    expect(screen.getByTestId("crd-source")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-cell")).toBeInTheDocument();
  });
});