export const FieldTemplate = (props) => {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children
  } = props;
  return (
    <div className={`${classNames}`}>
      {label ? (
        <label htmlFor={id} className="border border-yellow-500">
          {label}
          {required ? "*" : null}
        </label>
      ) : null}
      {description}
      {children}
      {errors}
      {help}
    </div>
  );
};
