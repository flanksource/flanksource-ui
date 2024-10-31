import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const hideComponentPropertiesAtom = atomWithStorage(
  "hideComponentProperties",
  false,
  undefined,
  {
    getOnInit: true
  }
);

export function useTopologyHidePropertiesPreference() {
  return useAtom(hideComponentPropertiesAtom);
}

export default function TopologyHideProperties() {
  const [hideComponentProperties, setHideComponentProperties] = useAtom(
    hideComponentPropertiesAtom
  );

  return (
    <div className="flex items-center px-4 py-3">
      <Toggle
        label="Hide component properties"
        value={hideComponentProperties}
        onChange={(value) => {
          setHideComponentProperties(value);
        }}
        labelClassName="text-sm font-medium text-gray-700"
      />
    </div>
  );
}
