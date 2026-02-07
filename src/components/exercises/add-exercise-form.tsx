"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddExerciseFormProps {
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function AddExerciseForm({ onSubmit, onCancel }: AddExerciseFormProps) {
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
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2 sm:px-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del ejercicio"
        autoFocus
        className="flex-1 rounded-md border border-pt-border bg-pt-card px-3 py-1.5 text-sm text-white placeholder-pt-muted focus:border-pt-accent focus:outline-none"
      />
      <Button type="submit" disabled={!name.trim() || saving}>
        {saving ? "..." : "Agregar"}
      </Button>
      <Button variant="ghost" onClick={onCancel} disabled={saving}>
        Cancelar
      </Button>
    </form>
  );
}
