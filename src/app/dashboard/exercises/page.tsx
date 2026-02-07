"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { ExerciseLibrary } from "@/components/exercises/exercise-library";

export default function ExercisesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Ejercicios"
        description="Tu biblioteca de ejercicios para crear planes de entrenamiento."
      />

      <div className="mt-6">
        <ExerciseLibrary />
      </div>
    </div>
  );
}
