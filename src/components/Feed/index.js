import React, { Fragment } from "react";

import { TagIcon, UserCircleIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Feed({ items }) {
  return (
    <div className="container mx-auto">
      <div className="flow-root">
        <ul className="-mb-4">
          {items.map((item, idx) => (
            <li key={item.id}>
              <div className="relative pb-4">
                {idx !== items.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  {item.type === "comment" ? (
                    <>
                      {item.icon ? (
                        <div className="relative ">{item.icon}</div>
                      ) : (
                        <div className="relative px-1">
                          <div className="h-8 w-8 px-1 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                            <UserCircleIcon
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a
                              href={item.person.href}
                              className="font-medium text-gray-900"
                            >
                              {item.person.name}
                            </a>{" "}
                            added tags{" "}
                          </div>
                          {/* <p className="mt-0.5 text-sm text-gray-500">Commented {item.date}</p> */}
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{item.comment}</p>
                        </div>
                      </div>

                      {item.tags != null && (
                        <span className="mr-0.5">
                          {item.tags.map((tag) => (
                            <Fragment key={tag.name}>
                              <a
                                href={tag.href}
                                className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm"
                              >
                                <span className="absolute flex-shrink-0 flex items-center justify-center">
                                  <span
                                    className={classNames(
                                      tag.color,
                                      "h-1.5 w-1.5 rounded-full"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="ml-3.5 font-medium text-gray-900">
                                  {tag.name}
                                </span>
                              </a>{" "}
                            </Fragment>
                          ))}
                        </span>
                      )}
                    </>
                  ) : item.type === "assignment" ? (
                    <>
                      <div>
                        <div className="relative px-1">
                          <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                            <UserCircleIcon
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-gray-500">
                          <a
                            href={item.person.href}
                            className="font-medium text-gray-900"
                          >
                            {item.person.name}
                          </a>{" "}
                          assigned{" "}
                          <a
                            href={item.assigned.href}
                            className="font-medium text-gray-900"
                          >
                            {item.assigned.name}
                          </a>{" "}
                          <span className="whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    </>
                  ) : item.type === "tags" ? (
                    <>
                      <div>
                        <div className="relative px-1">
                          <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                            <TagIcon
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 py-0">
                        <div className="text-sm leading-8 text-gray-500">
                          <span className="mr-0.5">
                            <a
                              href={item.person.href}
                              className="font-medium text-gray-900"
                            >
                              {item.person.name}
                            </a>{" "}
                            added tags
                          </span>{" "}
                          <span className="mr-0.5">
                            {item.tags.map((tag) => (
                              <Fragment key={tag.name}>
                                <a
                                  href={tag.href}
                                  className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm"
                                >
                                  <span className="absolute flex-shrink-0 flex items-center justify-center">
                                    <span
                                      className={classNames(
                                        tag.color,
                                        "h-1.5 w-1.5 rounded-full"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </span>
                                  <span className="ml-3.5 font-medium text-gray-900">
                                    {tag.name}
                                  </span>
                                </a>{" "}
                              </Fragment>
                            ))}
                          </span>
                          <span className="whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
