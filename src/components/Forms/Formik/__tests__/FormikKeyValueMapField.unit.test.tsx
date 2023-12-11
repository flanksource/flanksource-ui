import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import FormikKeyValueMapField from "./../FormikKeyValueMapField";

describe("FormikKeyValueMapField", () => {
  const initialValues = {
    myMap: {
      key1: "value1",
      key2: "value2"
    }
  };

  it("renders the label", async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" />
        </Form>
      </Formik>
    );
    await waitFor(() => {
      expect(screen.getByText("My Map")).toBeInTheDocument();
    });
  });

  it("renders the existing key-value pairs", async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" />
        </Form>
      </Formik>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue("key1")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("value1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("key2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("value2")).toBeInTheDocument();
  });

  it("adds a new key-value pair when the Add button is clicked", async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" />
        </Form>
      </Formik>
    );

    await expect(
      screen.findByRole("button", {
        name: "Add"
      })
    ).resolves.toBeInTheDocument();
    const addButton = screen.getByRole("button", {
      name: "Add"
    });
    userEvent.click(addButton);
    expect(screen.getByDisplayValue("key1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("value1")).toBeInTheDocument();
  });

  it("removes a key-value pair when the Remove button is clicked", async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" />
        </Form>
      </Formik>
    );
    await expect(screen.findAllByLabelText(/remove/i)).resolves.toHaveLength(2);
    userEvent.click(screen.getAllByLabelText(/remove/i)[0]);

    await waitFor(() => {
      expect(screen.queryByDisplayValue("key1")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByDisplayValue("value1")).not.toBeInTheDocument();
    });
  });

  it("updates the formik values when a key or value is changed", async () => {
    const onSubmit = jest.fn();
    render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("key1")).toBeInTheDocument();
    });

    const keyInput = screen.getByDisplayValue("key1");
    fireEvent.change(keyInput, {
      target: {
        value: "newKey"
      }
    });
    const valueInput = screen.getByDisplayValue("value1");
    fireEvent.change(valueInput, {
      target: {
        value: "newValue"
      }
    });
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          myMap: {
            newKey: "newValue",
            key2: "value2"
          }
        },
        expect.anything()
      );
    });
  });

  // support for JSON
  it("updates the formik values when a key or value is changed and json is true", async () => {
    const onSubmit = jest.fn();
    render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <FormikKeyValueMapField name="myMap" label="My Map" outputJson />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("key1")).toBeInTheDocument();
    });

    const keyInput = screen.getByDisplayValue("key1");
    fireEvent.change(keyInput, {
      target: {
        value: "newKey"
      }
    });
    const valueInput = screen.getByDisplayValue("value1");
    fireEvent.change(valueInput, {
      target: {
        value: "newValue"
      }
    });
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          myMap: JSON.stringify({
            newKey: "newValue",
            key2: "value2"
          })
        },
        expect.anything()
      );
    });
  });
});
