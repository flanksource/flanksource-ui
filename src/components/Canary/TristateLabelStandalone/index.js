import { useEffect, useState } from "react";
import { TristateToggle } from "../../TristateToggle";
import { updateParams, decodeUrlSearchParams } from "./../url";
import { getConciseLabelState } from "./../labels";

const TristateLabelStandalone = ({ label, className, labelClass, ...rest }) => {
  const { labels: urlLabelState = {} } = decodeUrlSearchParams(
    window.location.search
  );
  const [toggleState, setToggleState] = useState(0);

  const handleToggleChange = (v) => {
    const { labels: urlLabelState } = decodeUrlSearchParams(
      window.location.search
    );
    const newState = { ...urlLabelState };
    newState[label.id] = v;
    const conciseLabelState = getConciseLabelState(newState);
    updateParams({ labels: conciseLabelState });
    setToggleState(v);
  };

  // get initial state from URL
  useEffect(() => {
    const { labels: urlLabelState = {} } = decodeUrlSearchParams(
      window.location.search
    );
    if (Object.prototype.hasOwnProperty.call(urlLabelState, label.id)) {
      setToggleState(urlLabelState[label.id]);
    } else {
      setToggleState(0);
    }
  }, [label, urlLabelState]);

  return (
    <TristateToggle
      value={toggleState}
      onChange={(v) => handleToggleChange(v)}
      className={className}
      labelClass={labelClass}
      label={label}
      {...rest}
    />
  );
};

export default TristateLabelStandalone;
