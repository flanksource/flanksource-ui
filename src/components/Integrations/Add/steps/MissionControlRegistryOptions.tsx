import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import { Form, Formik } from "formik";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import { IntegrationOption } from "./AddIntegrationOptionsList";
import RegistryInstallationInstructions from "./RegistryInstallationGuide/RegistryInstallationInstructions";
import Admonition from "@flanksource-ui/ui/BannerMessage/Admonition";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import { useWindowSize } from "react-use-size";
import { Button } from "@flanksource-ui/ui/Buttons/Button";

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
  selectedOption: IntegrationOption;
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
  const { height } = useWindowSize();
  var lines = 6;
  if (height && height > 1024) {
    lines = 8;
  }

  return (
    <div className="flex flex-col gap-2  h-full justify-between ">
      <Formik
        initialValues={{
          id: "",
          name: selectedOption.name,
          namespace: "mission-control",
          createNamespace: true,
          createRepository: true,

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
            className="flex flex-col flex-1 h-full justify-between"
          >
            <div className="flex flex-col gap-4 p-4 overflow-y-auto mb-auto h-full flex-1">
              {selectedOption.dependencies &&
                selectedOption.dependencies.length > 0 && (
                  <Admonition text={selectedOption.dependencies[0]} />
                )}
              <FormikTextInput
                label="Namespace"
                name="namespace"
                placeholder="Namespace"
                defaultValue="default"
              />

              <FormikCheckbox
                label="Create Namespace"
                hintPosition="tooltip"
                hint="Create a new namespace if it doesn't exist"
                name="createNamespace"
              />
              <FormikCheckbox
                label="Create Helm Repository"
                hintPosition="tooltip"
                hint="Install the Helm Repository (can skip if other integrations previously installed it)"
                name="createRepository"
              />

              <FormikCodeEditor
                fieldName="chartValues"
                label="Values"
                hint="The Helm Chart values to pass through"
                hintPosition="tooltip"
                lines={lines}
                jsonSchemaUrl={selectedOption?.schemaURL}
                className="flex flex-col"
              />

              <RegistryInstallationInstructions
                selectedOption={selectedOption!}
                formValues={values}
              />
            </div>

            <div className={`flex flex-col ${footerClassName}`}>
              <div className="flex flex-1 flex-row items-center space-x-4 justify-between">
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
                  className="btn-primary"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
