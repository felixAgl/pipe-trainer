import { PageHeader } from "@/components/dashboard/page-header";
import { PlanList } from "@/components/plans/plan-list";

export default function PlansPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Planes"
        description="Planes de entrenamiento guardados para tus clientes."
      />

      <div className="mt-6">
        <PlanList />
      </div>
    </div>
  );
}
