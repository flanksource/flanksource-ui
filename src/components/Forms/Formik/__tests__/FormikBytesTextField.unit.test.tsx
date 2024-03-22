import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form, Formik } from "formik";
import FormikBytesTextField from "../FormikBytesTextField";

function TestForm({
  onSubmit,
  initialValues
}: {
  onSubmit: (values: any) => void;
  initialValues?: {
    bytes?: string;
  };
}) {
  return (
    <Formik
      initialValues={{
        ...initialValues
      }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ handleSubmit, handleReset, values }) => (
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          onReset={handleReset}
          className="flex flex-col flex-1 overflow-y-auto space-y-4"
        >
          <div className="w-full h-full flex flex-col gap-4 overflow-y-auto p-4">
            <FormikBytesTextField name="bytes" label="Bytes" />
            <button type="submit">Submit</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

test("it should have a default values", () => {
  const submit = jest.fn();
  const initialValues = {
    bytes: "100Mi"
  };
  render(<TestForm onSubmit={submit} initialValues={initialValues} />);
  expect(screen.getByLabelText("Bytes")).toHaveValue(100);
});

test("it should submit the form with the correct values", async () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} />);
  const input = screen.getByLabelText("Bytes");
  const submitButton = screen.getByRole("button", { name: "Submit" });
  expect(input).toHaveValue(null);
  fireEvent.change(input, { target: { value: "100" } });
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(submit).toHaveBeenCalledWith({ bytes: "100Mi" });
  });
});
