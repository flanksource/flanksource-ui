import clsx from "clsx";
import { Form, Formik } from "formik";
import { Modal } from "../Modal";
import { Property } from "../../services/permissions/permissionsService";
import { resourceList } from "../../services/permissions/resources";
import FormikSelect from "../Forms/Formik/FormikSelect";
import { toastError } from "../Toast/toast";

type FeatureFlagFormProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onFeatureFlagSubmit: (data: Partial<Property>) => Promise<any>;
  onFeatureFlagDelete: (data: Partial<Property>) => Promise<any>;
  formValue?: Partial<Property>;
};

export default function FeatureFlagForm({
  className,
  isOpen,
  setIsOpen,
  onFeatureFlagSubmit,
  onFeatureFlagDelete,
  formValue,
  ...props
}: FeatureFlagFormProps) {
  return (
    <Modal
      title="Add Feature Flag"
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      bodyClass=""
    >
      <Formik
        initialValues={
          formValue || {
            name: "",
            value: ""
          }
        }
        onSubmit={(value) => {
          if (!value.name || !value.value) {
            toastError(`please provide all details`);
            return;
          }
          onFeatureFlagSubmit?.(value);
        }}
      >
        <Form>
          <div
            className={clsx("flex flex-col h-full", className)}
            style={{ maxHeight: "calc(100vh - 8rem)" }}
            {...props}
          >
            <div className={clsx("flex flex-col px-2 mb-2")}>
              <div className="flex flex-row overflow-y-auto px-2 py-12 justify-center">
                <div className="flex-1">
                  <FormikSelect name="name" label="Feature flag">
                    <>
                      <option value="">select any</option>
                      {resourceList.map((item) => {
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </>
                  </FormikSelect>
                </div>
                <div className="flex-1">
                  <FormikSelect name="value" label="Value">
                    <>
                      <option value="">select value</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </>
                  </FormikSelect>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center py-4 px-5 rounded-lg bg-gray-100">
            {Boolean(formValue?.created_at) && (
              <button
                className="inline-flex items-center justify-center border-none shadow-sm font-medium rounded-md text-red-500 bg-red-100 hover:bg-red-200 focus:ring-offset-white focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm leading-5"
                onClick={() => {
                  onFeatureFlagDelete?.(formValue!);
                }}
                type="button"
              >
                Delete
              </button>
            )}
            <div className="flex flex-1 justify-end">
              <button
                className="btn-secondary-base btn-secondary mr-4"
                type="reset"
              >
                Cancel
              </button>
              <button className="btn-primary" type="submit">
                Save
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
}
