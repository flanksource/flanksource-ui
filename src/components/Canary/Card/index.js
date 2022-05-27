/* This example requires Tailwind CSS v2.0+ */
import { Icon } from "../../Icon";

/**
 * bgColor,
 * initials,
 * href,
 * title,
 * subtitle
 * @param  {...any} classes
 * @returns
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  cards,
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
}) {
  return (
    <>
      <ul className={`mt-3 grid gap-5 sm:gap-6 ${className} "`}>
        {cards.map((card) => (
          <li key={card.name} className="col-span-1 flex shadow-sm rounded-md">
            <div
              className={classNames(
                card.bgColor,
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {card.initials}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a
                  href={card.href}
                  className="text-gray-900 font-medium hover:text-gray-600"
                >
                  {card.title}
                </a>
                <p className="text-gray-500">{card.subtitle}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function HorizontalCard({
  cards,
  className = "grid-cols-1 gap-4 sm:grid-cols-2"
}) {
  return (
    <div className={`grid ${className}"`}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative mb-5 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          {card.icon != null && (
            <div className="flex-shrink-0">
              <Icon
                icon={card.icon}
                className={`${card.bgColor} h-10 w-10 rounded-full`}
                size=""
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* TODO Add a valid anchor tag */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{card.title}</p>
              <p className="text-sm text-gray-500 truncate">{card.subtitle}</p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
