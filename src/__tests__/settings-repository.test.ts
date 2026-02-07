import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockStorage: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

vi.stubGlobal("localStorage", localStorageMock);

import {
  getSettings,
  saveSettings,
  resetSettings,
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from "@/lib/settings-repository";
import type { AppSettings } from "@/lib/settings-repository";

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
});

afterEach(() => {
  document.documentElement.style.removeProperty("--pt-accent");
});

describe("getSettings", () => {
  it("should return defaults when no stored settings", () => {
    const settings = getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it("should return stored settings merged with defaults", () => {
    mockStorage[SETTINGS_KEY] = JSON.stringify({ brandName: "MiGym" });
    const settings = getSettings();
    expect(settings.brandName).toBe("MiGym");
    expect(settings.accentColor).toBe(DEFAULT_SETTINGS.accentColor);
  });

  it("should return defaults on corrupt JSON", () => {
    mockStorage[SETTINGS_KEY] = "not-json{{{";
    const settings = getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });
});

describe("saveSettings", () => {
  it("should persist settings to localStorage", () => {
    const custom: AppSettings = {
      ...DEFAULT_SETTINGS,
      brandName: "GymPro",
      accentColor: "#FF0000",
    };
    saveSettings(custom);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      SETTINGS_KEY,
      JSON.stringify(custom)
    );
  });

  it("should apply accent color to document", () => {
    saveSettings({ ...DEFAULT_SETTINGS, accentColor: "#00FF00" });
    const style = document.documentElement.style.getPropertyValue("--pt-accent");
    expect(style).toBe("#00FF00");
  });
});

describe("resetSettings", () => {
  it("should remove settings from localStorage", () => {
    mockStorage[SETTINGS_KEY] = JSON.stringify({ brandName: "Old" });
    const result = resetSettings();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(SETTINGS_KEY);
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it("should reset accent color to default", () => {
    resetSettings();
    const style = document.documentElement.style.getPropertyValue("--pt-accent");
    expect(style).toBe(DEFAULT_SETTINGS.accentColor);
  });
});
