export default function DashboardOverview() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">
        <span className="font-black text-pt-accent italic">PT</span> Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clients" value="--" />
        <StatCard label="Plans" value="--" />
        <StatCard label="Exercises" value="--" />
        <StatCard label="Generated" value="--" />
      </div>

      <div className="mt-12 rounded-lg border border-pt-border bg-pt-card/50 p-8 text-center">
        <p className="text-lg text-pt-muted">
          Dashboard en construccion. Usa el{" "}
          <span className="font-semibold text-pt-accent">Generator</span> para crear planes.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-pt-border bg-pt-card p-6">
      <p className="text-xs font-semibold text-pt-muted uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
