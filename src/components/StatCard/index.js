export function StatCard({ title, value, customValue }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dl>
          <dt className="text-sm leading-5 font-medium text-gray-500 truncate">
            {title}
          </dt>
          {customValue ? (
            <dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
              {customValue}
            </dd>
          ) : (
            <dd className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
              {value}
            </dd>
          )}
        </dl>
      </div>
    </div>
  );
}
