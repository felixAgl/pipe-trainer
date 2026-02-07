import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function PlansPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Plans"
        description="Workout plans generated for your clients."
      />

      <div className="mt-6">
        <EmptyState
          title="No plans yet"
          description="Create your first workout plan using the Generator. Plans will appear here once generated."
          actionLabel="Go to Generator"
          actionHref="/dashboard/generator"
        />
      </div>
    </div>
  );
}
