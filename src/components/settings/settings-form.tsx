"use client";

import { useState, useEffect } from "react";
import { getSettings, saveSettings, resetSettings } from "@/lib/settings-repository";
import type { AppSettings } from "@/lib/settings-repository";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";

export function SettingsForm() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleChange<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  }

  function handleSave() {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
  }

  function handleReset() {
    const defaults = resetSettings();
    setSettings(defaults);
    setSaved(false);
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <SettingsSection title="Marca">
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <InputField
            label="Nombre de marca"
            value={settings.brandName}
            onChange={(v) => handleChange("brandName", v)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-pt-muted uppercase tracking-wide">
              Color acento
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-pt-border bg-pt-card"
              />
              <span className="text-sm text-white font-mono">{settings.accentColor}</span>
            </div>
          </div>
          <InputField
            label="Handle del coach"
            value={settings.coachHandle}
            onChange={(v) => handleChange("coachHandle", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Valores por defecto">
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
          <InputField
            label="Tiempo de descanso"
            value={settings.defaultRestTime}
            onChange={(v) => handleChange("defaultRestTime", v)}
          />
          <InputField
            label="RIR por defecto"
            value={String(settings.defaultRir)}
            onChange={(v) => handleChange("defaultRir", Number(v) || 0)}
            type="number"
          />
          <InputField
            label="RPE por defecto"
            value={String(settings.defaultRpe)}
            onChange={(v) => handleChange("defaultRpe", Number(v) || 0)}
            type="number"
          />
          <InputField
            label="Nota de cardio"
            value={settings.defaultCardioNote}
            onChange={(v) => handleChange("defaultCardioNote", v)}
            placeholder="Nota por defecto para cardio"
          />
        </div>
      </SettingsSection>

      <div className="flex gap-3">
        <Button onClick={handleSave}>
          {saved ? "Guardado" : "Guardar Cambios"}
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Restaurar Defaults
        </Button>
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
      {children}
    </div>
  );
}
