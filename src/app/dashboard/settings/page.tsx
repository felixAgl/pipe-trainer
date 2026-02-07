import { PageHeader } from "@/components/dashboard/page-header";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Configure defaults and brand settings."
      />

      <div className="mt-6 space-y-6">
        <SettingsSection title="Brand">
          <SettingsRow label="Brand Name" value="PipeTrainer" />
          <SettingsRow label="Accent Color" value="#DBFE53" />
          <SettingsRow label="Coach Handle" value="@Pipetrainer_11" />
        </SettingsSection>

        <SettingsSection title="Plan Defaults">
          <SettingsRow label="Default Rest Time" value="1:30 min" />
          <SettingsRow label="Default RIR" value="2" />
          <SettingsRow label="Default RPE" value="8" />
          <SettingsRow label="Default Cardio Note" value="--" />
        </SettingsSection>

        <SettingsSection title="Integrations">
          <SettingsRow label="Supabase" value="Not connected" />
          <SettingsRow label="Storage" value="localStorage (offline)" />
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50">
      <div className="border-b border-pt-border px-4 py-3 sm:px-6">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-pt-border">{children}</div>
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span className="text-sm font-medium text-pt-muted">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
