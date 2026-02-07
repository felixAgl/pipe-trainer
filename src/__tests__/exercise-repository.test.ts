import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

function buildChain() {
  const chain = {
    select: mockSelect.mockReturnThis(),
    insert: mockInsert.mockReturnThis(),
    update: mockUpdate.mockReturnThis(),
    delete: mockDelete.mockReturnThis(),
    order: mockOrder.mockReturnThis(),
    limit: mockLimit.mockReturnThis(),
    single: mockSingle,
    eq: mockEq,
  };
  return chain;
}

const mockFrom = vi.fn(() => buildChain());

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import {
  fetchMuscleGroupsWithExercises,
  createMuscleGroup,
  updateMuscleGroup,
  deleteMuscleGroup,
  createExercise,
  updateExercise,
  deleteExercise,
  fetchExercisesByMuscleGroup,
} from "@/lib/exercise-repository";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchMuscleGroupsWithExercises", () => {
  it("should fetch groups and nest exercises", async () => {
    const groups = [
      { id: "g1", name: "PIERNA", display_order: 0, created_at: "2025-01-01" },
      { id: "g2", name: "PECHO", display_order: 1, created_at: "2025-01-01" },
    ];
    const exercises = [
      { id: "e1", name: "Sentadilla", muscle_group_id: "g1", created_at: "2025-01-01" },
      { id: "e2", name: "Press banca", muscle_group_id: "g2", created_at: "2025-01-01" },
      { id: "e3", name: "Prensa", muscle_group_id: "g1", created_at: "2025-01-01" },
    ];

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      const chain = buildChain();
      if (callCount === 1) {
        mockOrder.mockReturnValue({ data: groups, error: null });
      } else {
        mockOrder.mockReturnValue({ data: exercises, error: null });
      }
      return chain;
    });

    const result = await fetchMuscleGroupsWithExercises();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("g1");
    expect(result[0].exercises).toHaveLength(2);
    expect(result[1].id).toBe("g2");
    expect(result[1].exercises).toHaveLength(1);
  });

  it("should throw on groups fetch error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockOrder.mockReturnValue({ data: null, error: { message: "Groups error" } });
      return chain;
    });

    await expect(fetchMuscleGroupsWithExercises()).rejects.toThrow("Groups error");
  });

  it("should throw on exercises fetch error", async () => {
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      const chain = buildChain();
      if (callCount === 1) {
        mockOrder.mockReturnValue({ data: [], error: null });
      } else {
        mockOrder.mockReturnValue({ data: null, error: { message: "Exercises error" } });
      }
      return chain;
    });

    await expect(fetchMuscleGroupsWithExercises()).rejects.toThrow("Exercises error");
  });
});

describe("createMuscleGroup", () => {
  it("should insert with next display_order", async () => {
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      const chain = buildChain();
      if (callCount === 1) {
        mockOrder.mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data: { display_order: 2 }, error: null }),
          }),
        });
      } else {
        mockInsert.mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({
              data: { id: "new-id", name: "HOMBRO", display_order: 3, created_at: "2025-01-01" },
              error: null,
            }),
          }),
        });
      }
      return chain;
    });

    const result = await createMuscleGroup("HOMBRO");

    expect(result.name).toBe("HOMBRO");
    expect(result.display_order).toBe(3);
  });

  it("should throw on insert error", async () => {
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      const chain = buildChain();
      if (callCount === 1) {
        mockOrder.mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data: null, error: null }),
          }),
        });
      } else {
        mockInsert.mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({
              data: null,
              error: { message: "Duplicate name" },
            }),
          }),
        });
      }
      return chain;
    });

    await expect(createMuscleGroup("PIERNA")).rejects.toThrow("Duplicate name");
  });
});

describe("updateMuscleGroup", () => {
  it("should update the group name", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(updateMuscleGroup("g1", "PIERNA NUEVA")).resolves.toBeUndefined();
  });

  it("should throw on update error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "Update failed" } }),
      });
      return chain;
    });

    await expect(updateMuscleGroup("g1", "BAD")).rejects.toThrow("Update failed");
  });
});

describe("deleteMuscleGroup", () => {
  it("should delete the group", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(deleteMuscleGroup("g1")).resolves.toBeUndefined();
  });

  it("should throw on delete error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "Delete failed" } }),
      });
      return chain;
    });

    await expect(deleteMuscleGroup("g1")).rejects.toThrow("Delete failed");
  });
});

describe("createExercise", () => {
  it("should insert an exercise", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            data: { id: "e-new", name: "Hip thrust", muscle_group_id: "g1", created_at: "2025-01-01" },
            error: null,
          }),
        }),
      });
      return chain;
    });

    const result = await createExercise("Hip thrust", "g1");
    expect(result.name).toBe("Hip thrust");
    expect(result.muscle_group_id).toBe("g1");
  });
});

describe("updateExercise", () => {
  it("should update the exercise name", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(updateExercise("e1", "Sentadilla libre")).resolves.toBeUndefined();
  });
});

describe("deleteExercise", () => {
  it("should delete the exercise", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(deleteExercise("e1")).resolves.toBeUndefined();
  });
});

describe("fetchExercisesByMuscleGroup", () => {
  it("should return a Record<string, string[]> grouped by muscle", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        order: vi.fn().mockReturnValue({
          data: [
            { name: "Pierna", exercises: [{ name: "Sentadilla" }, { name: "Prensa" }] },
            { name: "Pecho", exercises: [{ name: "Press banca" }] },
          ],
          error: null,
        }),
      });
      return chain;
    });

    const result = await fetchExercisesByMuscleGroup();

    expect(result).toEqual({
      PIERNA: ["Sentadilla", "Prensa"],
      PECHO: ["Press banca"],
    });
  });

  it("should return empty object on error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        order: vi.fn().mockReturnValue({
          data: null,
          error: { message: "Network error" },
        }),
      });
      return chain;
    });

    const result = await fetchExercisesByMuscleGroup();
    expect(result).toEqual({});
  });
});
