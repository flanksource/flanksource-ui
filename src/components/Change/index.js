import React, { Fragment } from "react";
/* This example requires Tailwind CSS v2.0+ */
import { BsFillGearFill, BsArrowUpRight } from "react-icons/bs";
import { AiFillAlert } from "react-icons/ai";

function Avatar({ person }) {
  return (
    <img src={person.imageUrl} alt={person.name} className="rounded-full" />
  );
}

const people = [
  {
    name: "Lindsay Walton",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    name: "Eduardo Benz",
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
  }
];

const timeline = [
  {
    id: 1,
    content: "Scaled backend app to 3 pods",
    // target: 'Front End Developer',
    href: "#",
    date: "30m ago",
    datetime: "2020-09-20",
    icon: <BsArrowUpRight className="h-5 w-5 text-white" />,
    iconBackground: "bg-gray-400"
  },
  {
    id: 2,
    content: "Changed db.pool.size from 100 -> 125",
    href: "#",
    date: "45m ago",
    datetime: "2020-09-22",
    icon: <BsFillGearFill className="h-5 w-5 text-white" />,
    iconBackground: "bg-gray-400"
  },
  {
    id: 3,
    content: "us-east-1 canary failed for 25m",
    date: "2h",
    datetime: "2020-09-28",
    icon: <AiFillAlert className="h-5 w-5 text-white" />,
    iconBackground: "bg-gray-500"
  },

  {
    id: 5,
    content: <>{people[0].name} assigned as commander</>,
    date: "1h ago",
    datetime: "2020-09-30",
    icon: <Avatar person={people[0]} />,
    iconBackground: "bg-blue-500 "
  },
  {
    id: 5,
    content: <>{people[1].name} assigned as communicator</>,
    date: "1h ago",
    datetime: "2020-09-30",
    icon: <Avatar person={people[1]} />,
    iconBackground: "bg-blue-500 "
  },
  {
    id: 4,
    content: (
      <span className="text-red-700">us-east-1 canary failing for 2h</span>
    ),
    date: "2h ago",
    datetime: "2020-09-28",
    icon: <AiFillAlert className="h-5 w-5 text-white" />,
    iconBackground: "bg-red-500"
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Changelog() {
  return (
    <div className="bg-white">
      <div className="flex justify-between py-4 border-b border-gray-200 mb-4">
        <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
          Changelog
        </h2>
      </div>
      <ul>
        {timeline.map((event, eventIdx) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={eventIdx}>
            <div className="relative pb-4">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    )}
                  >
                    {event.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-gray-500">
                      {event.content}{" "}
                      <a
                        href={event.href}
                        className="font-medium text-gray-900"
                      >
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
