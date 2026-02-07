import { describe, it, expect } from "vitest";
import { getSuggestions } from "@/lib/exercise-suggestions";

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

  it("should return empty array for empty query with unknown group", () => {
    const suggestions = getSuggestions("UNKNOWN_GROUP", "");
    // Should still return GENERAL exercises
    expect(suggestions.length).toBeGreaterThan(0);
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
});
