import { ChatAltIcon } from "@heroicons/react/solid";
import React from "react";

const sampleComments = [
  {
    id: 1,
    person: { name: "Eduardo Benz" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago"
  },
  {
    id: 2,
    person: { name: "Eduardo Benz" },
    imageUrl:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
    date: "6d ago"
  }
];

export function CommentsSection({ comments, titlePrepend, ...rest }) {
  const commentsList = sampleComments;
  const handleComment = () => console.log("handleComment");

  return (
    <div className={rest.className} {...rest}>
      {titlePrepend}
      <ul className="-mb-8">
        {commentsList.map((comment, commentIdx) => (
          <li key={comment.id}>
            <div className="relative pb-8">
              {commentIdx !== commentsList.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                    src={comment.imageUrl}
                    alt=""
                  />

                  <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                    <ChatAltIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <a
                        href={comment.person.href}
                        className="font-medium text-gray-900"
                      >
                        {comment.person.name}
                      </a>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Commented {comment.date}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{comment.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <textarea
          className="w-full text-sm p-2 border-gray-200 rounded-md h-20"
          style={{ minHeight: "80px" }}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleComment}
            className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
