import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import RoleForm from "./RoleForm";

export default function AddRoleButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" title="Add role" onClick={() => setIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      {isOpen && <RoleForm isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
