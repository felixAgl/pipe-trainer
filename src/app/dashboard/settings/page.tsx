import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Configuracion"
        description="Configura los valores por defecto y la marca."
      />

      <div className="mt-6">
        <SettingsForm />
      </div>
    </div>
  );
}
