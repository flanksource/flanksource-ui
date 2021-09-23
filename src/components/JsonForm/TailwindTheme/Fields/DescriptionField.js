export const DescriptionField = (props) => {
  const { id, description } = props;
  return (
    <>
      {description && description !== "" && (
        <p id={id} className="">
          {description}
        </p>
      )}
    </>
  );
};
