const ArrayFieldTemplate = (props) => {
  const { items, canAdd, onAddClick, title } = props;
  return (
    <div className="flex flex-col border border-blue-400">
      <h1>{title}</h1>

      <div className="flex flex-col">
        {items.map((element) => (
          <div className="flex flex-row" key={element.key}>
            <div className="flex-grow">{element.children}</div>
            {element.hasRemove ? (
              <button
                type="button"
                onClick={() => element.onDropIndexClick(element.index)()}
                className="border border-red-400"
              >
                remove
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {canAdd && (
        <button
          className=" border border-green-400"
          type="button"
          onClick={onAddClick}
        >
          Add
        </button>
      )}
    </div>
  );
};

const myWidgets = {};

export const Theme = {
  widgets: myWidgets,
  fields: {},
  ArrayFieldTemplate
};
