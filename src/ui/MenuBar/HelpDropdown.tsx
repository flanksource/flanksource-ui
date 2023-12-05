import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { IoHelpOutline } from "react-icons/io5";
import { useIntercom } from "react-use-intercom";
import { ClickableSvg } from "../../components/ClickableSvg/ClickableSvg";

const isIntercomSetup = !!process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

function IntercomButton() {
  const { boot, update } = useIntercom();

  const showIntercom = () => {
    boot();
    update({
      hideDefaultLauncher: false
    });
  };

  return (
    <Menu.Item>
      <button
        onClick={() => showIntercom()}
        className="block py-2 px-4 space-x-2 text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
      >
        <IoIosChatbubbles size={20} className="inline-block" />
        <span>Chat</span>
      </button>
    </Menu.Item>
  );
}

export function HelpDropdown() {
  return (
    <Menu as="div" className="ml-3 relative flex-shrink-0">
      <div>
        <Menu.Button className="flex items-center text-sm rounded-full text-gray-400">
          <ClickableSvg>
            <IoHelpOutline size={24} />
          </ClickableSvg>
        </Menu.Button>
      </div>
      {/* @ts-ignore */}
      <Transition
        as={Fragment as any}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bg-white focus:outline-none mt-2 opacity-100 origin-top-right right-0 ring-1 ring-black ring-opacity-5 rounded-md scale-100 shadow-md transform w-64">
          <Menu.Item>
            <a
              href="https://docs.flanksource.com/"
              target="_blank"
              className="block py-2 px-4 text-sm text-gray-700 space-x-2  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
              rel="noreferrer"
            >
              <span>Docs</span>
            </a>
          </Menu.Item>
          {isIntercomSetup && <IntercomButton />}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
