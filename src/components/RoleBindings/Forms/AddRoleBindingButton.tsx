import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import RoleBindingForm from "./RoleBindingForm";

export default function AddRoleBindingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title="Add role binding"
        onClick={() => setIsOpen(true)}
      >
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      {isOpen && (
        <RoleBindingForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
