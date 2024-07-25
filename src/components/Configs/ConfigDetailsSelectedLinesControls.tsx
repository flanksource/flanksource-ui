import { Button } from "../../ui/Buttons/Button";

type Props = {
  selectedCount: number;
  setChecked: (checked: Record<string, boolean>) => void;
  setAttachAsAsset: (attachAsAsset: boolean) => void;
};

export function ConfigDetailsSelectedLinesControls({
  selectedCount,
  setChecked,
  setAttachAsAsset
}: Props) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-row space-x-2">
      {selectedCount > 0 && (
        <>
          <div className="mx-4 flex items-center">
            {selectedCount} lines selected
          </div>
          <Button
            className="btn-secondary"
            text="Clear"
            onClick={() => {
              setChecked({});
            }}
          />
        </>
      )}
      <button
        type="button"
        onClick={() => {
          setAttachAsAsset(true);
          /* setDialogKey(Math.floor(Math.random() * 1000)); */
        }}
        className="btn-primary"
      >
        Attach to Incident
      </button>
    </div>
  );
}
