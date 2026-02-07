const SETTINGS_KEY = "pt-settings";

interface AppSettings {
  brandName: string;
  accentColor: string;
  coachHandle: string;
  defaultRestTime: string;
  defaultRir: number;
  defaultRpe: number;
  defaultCardioNote: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  brandName: "PipeTrainer",
  accentColor: "#DBFE53",
  coachHandle: "@Pipetrainer_11",
  defaultRestTime: "1:30 min",
  defaultRir: 2,
  defaultRpe: 8,
  defaultCardioNote: "",
};

function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyAccentColor(settings.accentColor);
}

function resetSettings(): AppSettings {
  localStorage.removeItem(SETTINGS_KEY);
  applyAccentColor(DEFAULT_SETTINGS.accentColor);
  return { ...DEFAULT_SETTINGS };
}

function applyAccentColor(color: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--pt-accent", color);
  }
}

function initializeSettings(): void {
  const settings = getSettings();
  applyAccentColor(settings.accentColor);
}

export {
  SETTINGS_KEY,
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  resetSettings,
  initializeSettings,
};
export type { AppSettings };
