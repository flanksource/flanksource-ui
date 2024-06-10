/**
 * Example of how to set up chatlio widget using Flanksource UI Snippets
 *
 * @param {*} user
 * @param {*} organization
 */

function setUpChat({ user, organization }) {
  var wEl = document.createElement("script");
  wEl.setAttribute("src", "https://js.chatlio.com/widget.js");
  wEl.setAttribute("async", "");
  document.head.appendChild(wEl);
  var cEl = document.createElement("chatlio-widget");
  cEl.setAttribute("widgetid", "3038bb4f-d8a9-4d33-548d-3bc8d18a204b");
  document.body.appendChild(cEl);

  console.log({ user, organization });

  document.addEventListener(
    "chatlio.ready",
    function (e) {
      console.log({ user, organization });
      console.log("Chatlio ready");

      _chatlio.identify(user?.id, {
        name: user?.name,
        email: user?.email,
        organization: organization
      });
    },
    false
  );
}
