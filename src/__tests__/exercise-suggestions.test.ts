import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/exercise-repository", () => ({
  fetchExercisesByMuscleGroup: vi.fn().mockResolvedValue({}),
}));

import {
  getSuggestions,
  invalidateCache,
  EXERCISE_SUGGESTIONS,
} from "@/lib/exercise-suggestions";
import { fetchExercisesByMuscleGroup } from "@/lib/exercise-repository";

const mockFetch = vi.mocked(fetchExercisesByMuscleGroup);

beforeEach(() => {
  vi.clearAllMocks();
  invalidateCache();
  mockFetch.mockResolvedValue({});
});

describe("getSuggestions", () => {
  it("should return exercises for a known muscle group", () => {
    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain("Sentadilla hack");
  });

  it("should be case-insensitive for muscle group", () => {
    const upper = getSuggestions("PIERNA", "");
    const lower = getSuggestions("pierna", "");
    expect(upper).toEqual(lower);
  });

  it("should filter by query string", () => {
    const suggestions = getSuggestions("PIERNA", "sent");
    expect(suggestions.every((s) => s.toLowerCase().includes("sent"))).toBe(true);
  });

  it("should return GENERAL exercises for unknown group", () => {
    const suggestions = getSuggestions("UNKNOWN_GROUP", "");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain("Plancha");
  });

  it("should include GENERAL exercises for any group", () => {
    const suggestions = getSuggestions("PECHO", "");
    expect(suggestions).toContain("Plancha");
  });

  it("should return filtered results matching the query", () => {
    const suggestions = getSuggestions("PECHO", "press");
    expect(suggestions.length).toBeGreaterThan(0);
    suggestions.forEach((s) => {
      expect(s.toLowerCase()).toContain("press");
    });
  });

  it("should return empty array when no group and no general match query", () => {
    const suggestions = getSuggestions("UNKNOWN", "zzzzzzz");
    expect(suggestions).toEqual([]);
  });
});

describe("Supabase cache integration", () => {
  it("should fire a fetch on first call", () => {
    getSuggestions("PIERNA", "");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should not fire concurrent fetches", () => {
    getSuggestions("PIERNA", "");
    getSuggestions("PECHO", "");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should use Supabase data once cache resolves", async () => {
    mockFetch.mockResolvedValue({
      PIERNA: ["Supabase Sentadilla"],
      GENERAL: ["Supabase Plancha"],
    });

    getSuggestions("PIERNA", "");
    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Let the promise resolve
    await new Promise((r) => setTimeout(r, 0));

    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions).toContain("Supabase Sentadilla");
    expect(suggestions).toContain("Supabase Plancha");
    expect(suggestions).not.toContain("Sentadilla hack");
  });

  it("should keep hardcoded fallback when Supabase returns empty", async () => {
    mockFetch.mockResolvedValue({});

    getSuggestions("PIERNA", "");
    await new Promise((r) => setTimeout(r, 0));

    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions).toContain("Sentadilla hack");
  });

  it("should keep hardcoded fallback on fetch error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    getSuggestions("PIERNA", "");
    await new Promise((r) => setTimeout(r, 0));

    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions).toContain("Sentadilla hack");
  });
});

describe("invalidateCache", () => {
  it("should force re-fetch after invalidation", async () => {
    mockFetch.mockResolvedValue({
      PIERNA: ["Exercise A"],
    });

    getSuggestions("PIERNA", "");
    await new Promise((r) => setTimeout(r, 0));
    expect(mockFetch).toHaveBeenCalledTimes(1);

    invalidateCache();

    mockFetch.mockResolvedValue({
      PIERNA: ["Exercise B"],
    });

    getSuggestions("PIERNA", "");
    await new Promise((r) => setTimeout(r, 0));
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions).toContain("Exercise B");
  });

  it("should revert to hardcoded when invalidated and fetch fails", async () => {
    mockFetch.mockResolvedValue({
      PIERNA: ["Supabase exercise"],
    });

    getSuggestions("PIERNA", "");
    await new Promise((r) => setTimeout(r, 0));

    invalidateCache();
    mockFetch.mockRejectedValue(new Error("fail"));

    // After invalidation, supabaseExercises is null, so fallback is used
    const suggestions = getSuggestions("PIERNA", "");
    expect(suggestions).toContain("Sentadilla hack");
  });
});

describe("EXERCISE_SUGGESTIONS export", () => {
  it("should export hardcoded suggestions", () => {
    expect(EXERCISE_SUGGESTIONS).toBeDefined();
    expect(Object.keys(EXERCISE_SUGGESTIONS).length).toBeGreaterThan(0);
    expect(EXERCISE_SUGGESTIONS["PIERNA"]).toContain("Sentadilla hack");
  });
});
