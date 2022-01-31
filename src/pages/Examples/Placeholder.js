export function Placeholder({ text }) {
  return (
    <div className="py-4">
      <div className="h-96 border-4 border-dashed border-gray-200 rounded-lg">
        {text}
      </div>
    </div>
  );
}
