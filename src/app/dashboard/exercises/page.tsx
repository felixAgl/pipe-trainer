import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function ExercisesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Exercises"
        description="Your exercise library for building workout plans."
      />

      <div className="mt-6">
        <EmptyState
          title="No exercises yet"
          description="Build your exercise library to use in the plan generator. Exercises can be organized by muscle group and equipment. Available once Supabase is connected."
        />
      </div>
    </div>
  );
}
