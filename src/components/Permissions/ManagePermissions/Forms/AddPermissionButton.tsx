import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import PermissionForm from "./PermissionForm";

export default function AddPermissionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className="" onClick={() => setIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <PermissionForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
