import FormikTextInput from "../Formik/FormikTextInput";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";

type ICMPHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function ICMPHealthFormEditor({
  fieldName: name,
  specsMapField
}: ICMPHealthFormEditorProps) {
  const { values, setFieldValue } = useFormikContext();

  const fieldName = `${name}.${specsMapField}`;

  const nameValue = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", nameValue);
  }, [nameValue, setFieldValue]);

  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.name`}
          label="Name"
        />
        <FormikIconPicker
          className="flex flex-col w-1/2"
          name={`${fieldName}.icon`}
          label="Icon"
        />
      </div>

      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput
        name={`${fieldName}.description`}
        label="Description"
        hint="Description for the check"
      />

      <FormikTextInput
        name={`${fieldName}.endpoint`}
        hint="Address to query using ICMP"
        label="Host"
        required
      />

      <FormikTextInput
        name={`${fieldName}.packetCount`}
        hint="Total number of packets to send per check"
        label="Packet count"
        type="number"
        min={0}
      />

      <FormikTextInput
        name={`${fieldName}.packetLossThreshold`}
        hint="Percent of total packets that are allowed to be lost"
        label="Packet loss threshold"
        type="number"
        min={0}
      />

      <FormikTextInput
        name={`${fieldName}.thresholdMillis`}
        hint="Expected response time threshold in ms"
        label="Threshold millis"
        type="number"
        min={0}
      />
    </>
  );
}
