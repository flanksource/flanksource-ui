import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import ScopeForm from "./ScopeForm";
import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";

export default function AddScopeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useScopesQuery();

  return (
    <>
      <button type="button" className="" onClick={() => setIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <ScopeForm
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          refetch();
        }}
      />
    </>
  );
}
