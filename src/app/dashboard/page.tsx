import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";

export default function DashboardOverview() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Dashboard" description="PipeTrainer coaching overview." />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Clients" value="--" />
        <StatCard label="Plans" value="--" />
        <StatCard label="Exercises" value="--" />
        <StatCard label="Generated" value="--" />
      </div>

      <div className="mt-8 rounded-lg border border-pt-border bg-pt-card/50 p-6 text-center sm:p-8">
        <p className="text-base text-pt-muted sm:text-lg">
          Dashboard en construccion. Usa el{" "}
          <Link href="/dashboard/generator" className="font-semibold text-pt-accent hover:underline">
            Generator
          </Link>{" "}
          para crear planes.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-pt-border bg-pt-card p-4 sm:p-6">
      <p className="text-xs font-semibold text-pt-muted uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</p>
    </div>
  );
}
