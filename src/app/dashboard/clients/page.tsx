import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function ClientsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Clients"
        description="Manage your coaching clients."
      />

      <div className="mt-6">
        <EmptyState
          title="No clients yet"
          description="Add your first client to start creating personalized workout plans. Client management will be available once Supabase is connected."
        />
      </div>
    </div>
  );
}
