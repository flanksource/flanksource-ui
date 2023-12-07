import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Formik, Form } from "formik";
import FormikSwitchField from "./../FormikSwitchField";
import userEvent from "@testing-library/user-event";

describe("FormikSwitchField", () => {
  it("renders correctly", () => {
    render(
      <Formik initialValues={{ switch: false }} onSubmit={jest.fn()}>
        <Form>
          <FormikSwitchField
            name="switch"
            label="Switch"
            options={[
              {
                label: "Switch 1",
                key: "switch-1"
              },
              {
                label: "Switch 2",
                key: "switch-2"
              }
            ]}
          />
        </Form>
      </Formik>
    );

    expect(screen.getByText("Switch")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Switch 1"
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Switch 2"
      })
    ).toBeInTheDocument();
  });

  it("updates field value when clicked", async () => {
    const submitFn = jest.fn();

    render(
      <Formik initialValues={{ switch: false }} onSubmit={submitFn}>
        {({ isValid, values }) => (
          <Form>
            <FormikSwitchField
              name="switch"
              label="Switch"
              options={[
                {
                  label: "Switch 1",
                  key: "switch-1"
                },
                {
                  label: "Switch 2",
                  key: "switch-2"
                }
              ]}
            />
            {/* a hack, to wait for the form state to change when switch is clicked */}
            {JSON.stringify(values)}
            <button disabled={!isValid} type="submit">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    );

    userEvent.click(screen.getByRole("button", { name: "Switch 1" }));

    await waitFor(() => {
      expect(
        screen.getByText("switch-1", {
          exact: false
        })
      ).toBeInTheDocument();
    });
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => {
      expect(submitFn).toHaveBeenCalledWith(
        {
          switch: "switch-1"
        },
        expect.anything()
      );
    });
  });
});
