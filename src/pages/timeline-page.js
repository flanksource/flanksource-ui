import timeline from "./Examples/timeline.svg";
import { SearchLayout } from "../components/Layout";

export function TimelinePage() {
  return (
    <SearchLayout title="Timeline">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <img
                  alt="traces"
                  src={timeline}
                  className="mx-auto"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </SearchLayout>
  );
}
