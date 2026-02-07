"use client";

import { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import type { ClientInsert } from "@/lib/client-repository";

interface AddClientFormProps {
  onSave: (client: ClientInsert) => Promise<void>;
  onCancel: () => void;
}

export function AddClientForm({ onSave, onCancel }: AddClientFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        notes: notes.trim() || null,
      });
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-pt-border bg-pt-card/50 p-4 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
        Nuevo Cliente
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Nombre"
          value={name}
          onChange={setName}
          placeholder="Nombre completo"
        />
        <InputField
          label="Telefono"
          value={phone}
          onChange={setPhone}
          placeholder="+54 11 1234-5678"
        />
        <InputField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="email@ejemplo.com"
          type="email"
        />
        <InputField
          label="Notas"
          value={notes}
          onChange={setNotes}
          placeholder="Notas adicionales"
        />
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
