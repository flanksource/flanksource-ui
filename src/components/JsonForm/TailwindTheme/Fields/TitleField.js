export const TitleField = (props) => {
  const { id, required, title } = props;
  return (
    <legend id={id} className="border border-green-400">
      {title} {required ? "*" : null}
    </legend>
  );
};
