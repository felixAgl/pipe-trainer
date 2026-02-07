import { PageHeader } from "@/components/dashboard/page-header";
import { ClientList } from "@/components/clients/client-list";

export default function ClientsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Clientes"
        description="Gestiona tus clientes de coaching."
      />

      <div className="mt-6">
        <ClientList />
      </div>
    </div>
  );
}
