export default function Description({ title, subtitle, items }) {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {title != null &&
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
          </div>
        }
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {items.map((item) => (

              <div key={item.key} className={`col-span-${item.colspan ? item.colspan : 1}`}>
                <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div >
    </>
  )
}
