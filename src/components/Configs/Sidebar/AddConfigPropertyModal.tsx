import { createConfigItemProperty } from "@flanksource-ui/api/services/configs";
import { Property } from "@flanksource-ui/api/types/topology";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Field, Form, Formik } from "formik";

type Props = {
  configId: string;
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (properties?: Property[]) => void;
};

type AddPropertyForm = {
  name: string;
  valueType: "text" | "value";
  text: string;
  value: string;
  link: string;
  link_label: string;
};

export default function AddConfigPropertyModal({
  configId,
  isOpen,
  onClose,
  onAdded
}: Props) {
  const { user } = useUser();

  return (
    <Modal
      title="Add Property"
      size="very-small"
      open={isOpen}
      onClose={onClose}
    >
      <Formik<AddPropertyForm>
        initialValues={{
          name: "",
          valueType: "text",
          text: "",
          value: "",
          link: "",
          link_label: ""
        }}
        onSubmit={async (values, formik) => {
          if (!user?.id) {
            toastError("Could not determine current user");
            return;
          }

          if (!values.name) {
            toastError("Please provide property name");
            formik.setSubmitting(false);
            return;
          }

          if (values.valueType === "text" && !values.text) {
            toastError("Please provide property text");
            formik.setSubmitting(false);
            return;
          }

          if (values.valueType === "value" && values.value === "") {
            toastError("Please provide property value");
            formik.setSubmitting(false);
            return;
          }

          try {
            const newProperty: Property = {
              name: values.name,
              ...(values.valueType === "value"
                ? { value: Number(values.value) }
                : { text: values.text }),
              ...(values.link
                ? { link: values.link, link_label: values.link_label }
                : {})
            };

            const result = await createConfigItemProperty(
              configId,
              user.id,
              newProperty
            );
            toastSuccess("Property added");
            onAdded?.(result?.properties);
            onClose();
          } catch (e) {
            toastError((e as Error).message);
          } finally {
            formik.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="flex flex-col gap-4 p-2">
              <FormikTextInput name="name" label="Name" required />
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Value type
                <Field
                  as="select"
                  name="valueType"
                  className="form-select mt-1 rounded border-gray-300 text-sm"
                >
                  <option value="text">Text</option>
                  <option value="value">Number</option>
                </Field>
              </label>
              {values.valueType === "value" ? (
                <FormikTextInput
                  name="value"
                  label="Value"
                  type="number"
                  required
                />
              ) : (
                <FormikTextInput name="text" label="Text" required />
              )}
              <FormikTextInput name="link" label="Link" />
              <FormikTextInput name="link_label" label="Link label" />
            </div>
            <div className="flex items-center justify-end rounded-lg bg-gray-100 px-5 py-4">
              <button
                className="btn-secondary-base btn-secondary mr-4"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <Button
                type="submit"
                text="Save"
                className="btn-primary"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
