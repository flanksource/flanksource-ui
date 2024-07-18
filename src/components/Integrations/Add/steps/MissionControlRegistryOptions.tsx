import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import clsx from "clsx";
import { Form, Formik } from "formik";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import { CreateIntegrationOption } from "./AddIntegrationOptionsList";
import RegistryInstallationInstructions, {
  selectedOptionChartsDetails
} from "./RegistryInstallationGuide/RegistryInstallationInstructions";

export type TopologyResource = {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  spec: Record<string, any>;
};

type TopologyResourceFormProps = {
  /**
   * The selected option from the create topology options list,
   * this is used to determine the initial values for the spec field
   * and is only used when creating a new topology. When updating a topology
   * the spec field is populated with the current topology's spec and this
   * prop is ignored.
   */
  selectedOption?: CreateIntegrationOption;
  onBack?: () => void;
  footerClassName?: string;
  onSuccess?: () => void;
};

export default function MissionControlRegistryOptions({
  onBack,
  selectedOption,
  footerClassName = "bg-gray-100 p-4",
  onSuccess = () => {}
}: TopologyResourceFormProps) {
  const chartDetails = selectedOptionChartsDetails.get(selectedOption!);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <Formik
        initialValues={{
          id: "",
          name: selectedOption,
          namespace: "mission-control",
          interval: "30m",
          labels: {}
        }}
        onSubmit={() => {
          onSuccess();
        }}
      >
        {({ isValid, handleSubmit, values }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              <FormikTextInput
                label="Namespace"
                name="namespace"
                placeholder="Namespace"
                defaultValue="default"
              />

              <FormikCodeEditor
                fieldName="chartValues"
                label="Values"
                jsonSchemaUrl={chartDetails?.schemaURL}
                className="flex h-[20rem] flex-col"
              />

              <RegistryInstallationInstructions
                selectedOption={selectedOption!}
                formValues={values}
              />
            </div>
            <div className={`flex flex-col ${footerClassName}`}>
              <div className="flex flex-1 flex-row items-center justify-between space-x-4">
                <Button
                  type="button"
                  text="Back"
                  className="btn-default btn-btn-secondary-base btn-secondary"
                  onClick={onBack}
                />

                <Button
                  disabled={!isValid}
                  type="submit"
                  text="Close"
                  className={clsx("btn-primary")}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
