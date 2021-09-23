export const CheckboxWidget = (props) => {
  const { id, label, onChange, value } = props;
  return (
    <input
      type="checkbox"
      id={id}
      label={label}
      value={value}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
    />
  );
};
