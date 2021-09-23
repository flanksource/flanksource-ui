export const ObjectFieldTemplate = (props) => {
  const { properties } = props;
  return (
    <>
      {properties.map((element) => (
        <div key={element.name} className="property-wrapper">
          {element.content}
        </div>
      ))}
    </>
  );
};
