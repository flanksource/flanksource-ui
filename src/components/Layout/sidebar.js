import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState, useCallback } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { IoChevronForwardOutline } from "react-icons/io5";
import { getUser } from "../../api/auth";
import { Icon } from "../Icon";
import { useOuterClick } from "../../lib/useOuterClick";
import { getLocalItem, setLocalItem } from "../../utils/storage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function SidebarLayout({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [collapseSidebar, setCollapseSidebar] = useState(false);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const localCollapsed = getLocalItem("sidebarCollapsed") ?? false;
    const sidebarCollapsed =
      typeof localCollapsed === "string"
        ? JSON.parse(localCollapsed)
        : localCollapsed;
    setCollapseSidebar(sidebarCollapsed);
  }, []);

  useEffect(() => {
    setLocalItem("sidebarCollapsed", collapseSidebar);
  }, [collapseSidebar]);

  const closeOnOuterClick = useCallback(() => {
    if (!collapseSidebar && window.innerWidth < 1024) {
      setCollapseSidebar(true);
    }
  }, [collapseSidebar]);

  const innerRef = useOuterClick(closeOnOuterClick);

  if (user == null) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex h-screen overflow-hidden">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 px-4 flex items-center">
                  <Icon name="flanksource" className="h-8 w-auto" />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group rounded-md py-2 px-2 flex items-center text-base font-medium"
                      >
                        <item.icon
                          className="text-gray-400 group-hover:text-gray-500 mr-4 flex-shrink-0 h-6 w-6"
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={clsx("transform duration-500 w-14", {
            "lg:w-64": !collapseSidebar
          })}
          ref={innerRef}
        >
          <div
            className={clsx("h-full transform duration-500 w-14", {
              "lg:w-64": !collapseSidebar
            })}
          >
            <button
              type="button"
              className={clsx(
                "absolute bg-white -right-2 top-20 border border-gray-300 rounded-full transform duration-500",
                { "rotate-180": !collapseSidebar }
              )}
              onClick={() => setCollapseSidebar((value) => !value)}
            >
              <IoChevronForwardOutline />
            </button>

            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="h-full border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white overflow-hidden">
              {collapseSidebar ? (
                <div className="w-14">
                  <Icon
                    name="flanksource-icon"
                    className="px-3 w-auto h-auto"
                  />
                </div>
              ) : (
                <Icon name="flanksource" className="w-auto h-auto px-4" />
              )}
              <div className="flex-grow mt-5 flex flex-col">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name} data-tip={item.name}>
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        <p
                          className={clsx("duration-300 transition-opacity", {
                            "opacity-0": collapseSidebar
                          })}
                        >
                          {item.name}
                        </p>
                      </NavLink>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
