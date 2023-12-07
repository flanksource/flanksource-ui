import { Navigate } from "react-router-dom";
import AddTopologyResource from "../../components/Topology/Settings/AddTopologyResource";
import { Head } from "../../components/Head/Head";

export function CreateTopologyPage() {
  return (
    <>
      <Head prefix="Create Topology" suffix=""></Head>

      <div className="flex flex-col h-full mx-auto w-full max-w-4xl py-6">
        <h3 className="text-lg font-semibold px-4">Create Topology</h3>
        <AddTopologyResource
          isModal={false}
          onSuccess={() => <Navigate to="/settings/topologies" />}
        />
      </div>
    </>
  );
}
