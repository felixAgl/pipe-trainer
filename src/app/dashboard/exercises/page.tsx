"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { ExerciseLibrary } from "@/components/exercises/exercise-library";

export default function ExercisesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Exercises"
        description="Your exercise library for building workout plans."
      />

      <div className="mt-6">
        <ExerciseLibrary />
      </div>
    </div>
  );
}
