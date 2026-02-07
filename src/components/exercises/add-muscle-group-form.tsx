"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddMuscleGroupFormProps {
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function AddMuscleGroupForm({ onSubmit, onCancel }: AddMuscleGroupFormProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-lg border border-pt-border bg-pt-card/50 p-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del grupo muscular"
        autoFocus
        className="flex-1 rounded-md border border-pt-border bg-pt-card px-3 py-2 text-sm text-white placeholder-pt-muted focus:border-pt-accent focus:outline-none"
      />
      <Button type="submit" disabled={!name.trim() || saving}>
        {saving ? "Guardando..." : "Agregar"}
      </Button>
      <Button variant="ghost" onClick={onCancel} disabled={saving}>
        Cancelar
      </Button>
    </form>
  );
}
