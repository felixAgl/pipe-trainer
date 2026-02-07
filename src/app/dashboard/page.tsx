import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardOverview() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Dashboard" description="PipeTrainer coaching overview." />

      <div className="mt-6">
        <OverviewStats />
      </div>

      <div className="mt-6">
        <RecentActivity />
      </div>

      <div className="mt-8 rounded-lg border border-pt-border bg-pt-card/50 p-6 text-center sm:p-8">
        <p className="text-base text-pt-muted sm:text-lg">
          Usa el{" "}
          <Link href="/dashboard/generator" className="font-semibold text-pt-accent hover:underline">
            Generator
          </Link>{" "}
          para crear planes de entrenamiento.
        </p>
      </div>
    </div>
  );
}
