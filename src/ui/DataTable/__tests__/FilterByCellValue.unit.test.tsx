import { render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import FilterByCellValue from "../FilterByCellValue";

const TestComponent = ({ onClick }: { onClick: (value?: string) => void }) => {
  const [searchParams] = useSearchParams();

  const searchValue = searchParams.get("paramKey");

  useEffect(() => {
    if (searchValue) {
      onClick(searchValue);
    }
  }, [onClick, searchValue]);

  return (
    <div className="flex flex-col">
      <FilterByCellValue filterValue="TestParam1" paramKey="paramKey">
        <div>Test</div>
      </FilterByCellValue>
    </div>
  );
};

test("renders correct value, when include button is clicked", async () => {
  const fn = jest.fn();

  render(
    <MemoryRouter>
      <TestComponent onClick={fn} />
    </MemoryRouter>
  );

  const includeButton = await screen.findByTitle("Include");
  includeButton.click();

  await waitFor(() => {
    expect(fn).toHaveBeenCalledWith("TestParam1:1");
  });
});

test("renders correct value, when exclude button is clicked", async () => {
  const fn = jest.fn();

  render(
    <MemoryRouter>
      <TestComponent onClick={fn} />
    </MemoryRouter>
  );

  const excludeButton = await screen.findByTitle("Exclude");
  excludeButton.click();

  await waitFor(() => {
    expect(fn).toHaveBeenCalledWith("TestParam1:-1");
  });
});
