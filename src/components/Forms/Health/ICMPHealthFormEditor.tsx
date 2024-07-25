import FormikIconPicker from "../Formik/FormikIconPicker";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import { useUpdateCanaryNameToFirstCheckName } from "./HTTPHealthFormEditor";

type ICMPHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function ICMPHealthFormEditor({
  fieldName: name,
  specsMapField
}: ICMPHealthFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  useUpdateCanaryNameToFirstCheckName(fieldName);

  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${fieldName}.name`}
          label="Name"
        />
        <FormikIconPicker
          className="flex w-1/2 flex-col"
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
