import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import AccessScopeForm from "./AccessScopeForm";
import { useAccessScopesQuery } from "@flanksource-ui/api/query-hooks/useAccessScopesQuery";

export default function AddAccessScopeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useAccessScopesQuery();

  return (
    <>
      <button type="button" className="" onClick={() => setIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <AccessScopeForm
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          refetch();
        }}
      />
    </>
  );
}
