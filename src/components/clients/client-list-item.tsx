"use client";

import { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import type { ClientRow, ClientUpdate } from "@/lib/client-repository";

interface ClientListItemProps {
  client: ClientRow;
  onUpdate: (id: string, updates: ClientUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function ClientDetailView({ client }: { client: ClientRow }) {
  const createdAt = new Date(client.created_at).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-3 border-t border-pt-border pt-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="text-xs font-medium text-pt-muted uppercase tracking-wide">
            Nombre
          </span>
          <p className="text-sm text-white">{client.name}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-pt-muted uppercase tracking-wide">
            Telefono
          </span>
          <p className="text-sm text-white">{client.phone || "-"}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-pt-muted uppercase tracking-wide">
            Email
          </span>
          <p className="text-sm text-white">{client.email || "-"}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-pt-muted uppercase tracking-wide">
            Creado
          </span>
          <p className="text-sm text-white">{createdAt}</p>
        </div>
        {client.notes && (
          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-pt-muted uppercase tracking-wide">
              Notas
            </span>
            <p className="text-sm text-white">{client.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClientListItem({ client, onUpdate, onDelete }: ClientListItemProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone ?? "");
  const [email, setEmail] = useState(client.email ?? "");
  const [notes, setNotes] = useState(client.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onUpdate(client.id, {
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        notes: notes.trim() || null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName(client.name);
    setPhone(client.phone ?? "");
    setEmail(client.email ?? "");
    setNotes(client.notes ?? "");
    setEditing(false);
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await onDelete(client.id);
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  function handleEdit() {
    setExpanded(false);
    setEditing(true);
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-pt-accent/30 bg-pt-card/80 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <InputField label="Nombre" value={name} onChange={setName} />
          <InputField label="Telefono" value={phone} onChange={setPhone} />
          <InputField label="Email" value={email} onChange={setEmail} type="email" />
          <InputField label="Notas" value={notes} onChange={setNotes} />
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{client.name}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-pt-muted">
            {client.phone && <span>{client.phone}</span>}
            {client.email && <span>{client.email}</span>}
            {client.notes && <span className="italic">{client.notes}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {confirmDelete ? (
            <>
              <Button variant="danger" onClick={handleDelete} disabled={saving}>
                Confirmar
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
                {expanded ? "Ocultar" : "Ver"}
              </Button>
              <Button variant="ghost" onClick={handleEdit}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>

      {expanded && <ClientDetailView client={client} />}
    </div>
  );
}
