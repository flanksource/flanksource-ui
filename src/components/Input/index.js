
import { MailIcon } from '@heroicons/react/solid'
import Icon from '../Icon'

export default function Input({
  name,
  label,
  icon,
  color = "indigo",
  leadingIcon,
  trailingIcon,
  error,
  prefix,
  type = "text",
  placeholder,
  value,
  help
}) {
  if (name == null) {
    name = label
  }

  var borderColor = "border-gray-300 "

  if (error != null) {
    color = "red"
    borderColor = "border-red-300 text-red-900 placeholder-red-300 "
  }

  var className = `"shadow-sm focus:ring-${color}-500 focus:border-${color}-500 block w-full sm:text-sm rounded-md ${borderColor}`
  if (leadingIcon != null) {
    className += " pl-10";
  }
  if (trailingIcon != null) {
    className += " pr-10"
  }
  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        {leadingIcon != null &&
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon={leadingIcon} className={`h-5 w-5 `} aria-hidden="true" />
          </div>
        }


        <input
          type={type}
          name={name}
          id={name}
          className={className}
          placeholder={placeholder}
          aria-describedby={`${name}-description`}
        />

        {trailingIcon != null &&
          <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
            <Icon icon={trailingIcon} className="h-5 w-5 " aria-hidden="true" />
          </div>
        }


      </div>
      {
        error != null &&
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      }
      {
        icon != null &&
        <>
          <span>adding icon</span>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon icon={icon} />
            {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" /> */}
          </div>
        </>
      }



      {
        help != null &&
        <p className="mt-2 text-sm text-gray-500" id={`${name}-description`}>
          {help}
        </p>
      }
    </div >
  )
}

/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

export function Example1() {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          name="email"
          id="email"
          className="block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
          placeholder="you@example.com"
          defaultValue="adamwathan"
          aria-invalid="true"
          aria-describedby="email-error"
        />

      </div>

    </div>
  )
}



/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'

export function Examp3le() {
  return (
    <div>
      <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
        Account number
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          name="account-number"
          id="account-number"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="000-00-0000"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}


/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export function Example2() {
  return (
    <div>
      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
        Company Website
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
          http://
        </span>
        <input
          type="text"
          name="company-website"
          id="company-website"
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          placeholder="www.example.com"
        />
      </div>
    </div>
  )
}


/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export function Example23() {
  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0.00"
          aria-describedby="price-currency"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
        </div>
      </div>
    </div>
  )
}


/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export function Example3() {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Search candidates
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="email"
            id="email"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
            placeholder="John Doe"
          />
        </div>
        <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
          <SortAscendingIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>Sort</span>
        </button>
      </div>
    </div>
  )
}


/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export function Exampl3e() {
  return (
    <div>
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        Quick search
      </label>
      <div className="mt-1 relative flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  )
}

