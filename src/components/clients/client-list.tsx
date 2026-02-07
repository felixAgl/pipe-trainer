"use client";

import { useState, useEffect } from "react";
import { fetchClients, createClient, updateClient, deleteClient } from "@/lib/client-repository";
import type { ClientRow, ClientInsert, ClientUpdate } from "@/lib/client-repository";
import { ClientListItem } from "@/components/clients/client-list-item";
import { AddClientForm } from "@/components/clients/add-client-form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { supabase } from "@/lib/supabase";

export function ClientList() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(client: ClientInsert) {
    await createClient(client);
    setShowForm(false);
    await loadData();
  }

  async function handleUpdate(id: string, updates: ClientUpdate) {
    await updateClient(id, updates);
    await loadData();
  }

  async function handleDelete(id: string) {
    await deleteClient(id);
    await loadData();
  }

  if (!supabase) {
    return (
      <div className="rounded-lg border border-pt-border bg-pt-card/50 p-6 text-center">
        <p className="text-sm text-pt-muted">
          Supabase no esta configurado. Configura las variables de entorno para gestionar clientes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg border border-pt-border bg-pt-card/30"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4">
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="secondary" onClick={loadData} className="mt-2">
          Reintentar
        </Button>
      </div>
    );
  }

  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.phone?.includes(search)
      )
    : clients;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputField
          value={search}
          onChange={setSearch}
          placeholder="Buscar cliente..."
          className="sm:max-w-xs"
        />
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Agregar Cliente"}
        </Button>
      </div>

      {showForm && (
        <AddClientForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-pt-border p-8 text-center">
          <p className="text-sm text-pt-muted">
            {clients.length === 0
              ? "No hay clientes todavia. Agrega tu primer cliente."
              : "No se encontraron clientes para esa busqueda."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
