import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

function buildChain() {
  return {
    select: mockSelect.mockReturnThis(),
    insert: mockInsert.mockReturnThis(),
    update: mockUpdate.mockReturnThis(),
    delete: mockDelete.mockReturnThis(),
    order: mockOrder.mockReturnThis(),
    single: mockSingle,
    eq: mockEq,
  };
}

const mockFrom = vi.fn(() => buildChain());

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import {
  fetchPlans,
  fetchPlanById,
  savePlan,
  updatePlan,
  deletePlan,
  countPlans,
} from "@/lib/plan-repository";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchPlans", () => {
  it("should fetch plans with client names", async () => {
    const rows = [
      {
        id: "p1",
        title: "Plan A",
        client_id: "c1",
        plan_data: {},
        weeks_count: 2,
        days_per_week: 5,
        created_at: "2025-01-01",
        updated_at: "2025-01-02",
        clients: { name: "Ana" },
      },
    ];

    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        order: vi.fn().mockReturnValue({ data: rows, error: null }),
      });
      return chain;
    });

    const result = await fetchPlans();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Plan A");
    expect(result[0].clientName).toBe("Ana");
  });

  it("should throw on fetch error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        order: vi.fn().mockReturnValue({ data: null, error: { message: "DB error" } }),
      });
      return chain;
    });

    await expect(fetchPlans()).rejects.toThrow("DB error");
  });
});

describe("fetchPlanById", () => {
  it("should return plan data for valid id", async () => {
    const planData = { id: "x", title: "Test", weeks: [], createdAt: "2025-01-01" };

    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { plan_data: planData }, error: null }),
        }),
      });
      return chain;
    });

    const result = await fetchPlanById("p1");
    expect(result).toEqual(planData);
  });

  it("should return null on error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: null, error: { message: "Not found" } }),
        }),
      });
      return chain;
    });

    const result = await fetchPlanById("bad-id");
    expect(result).toBeNull();
  });
});

describe("savePlan", () => {
  it("should insert a new plan and return id", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: "new-plan" }, error: null }),
        }),
      });
      return chain;
    });

    const plan = { id: "x", title: "Plan", weeks: [{ id: "w", weekNumber: 1, days: [{ id: "d" }] }], createdAt: "2025-01-01" };
    const result = await savePlan({ title: "Plan", plan: plan as never });
    expect(result).toBe("new-plan");
  });

  it("should throw on insert error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: null, error: { message: "Insert failed" } }),
        }),
      });
      return chain;
    });

    const fakePlan = { id: "x", title: "Bad", weeks: [{ id: "w", weekNumber: 1, days: [{ id: "d" }] }], createdAt: "2025-01-01" };
    await expect(savePlan({ title: "Bad", plan: fakePlan as never })).rejects.toThrow("Insert failed");
  });
});

describe("updatePlan", () => {
  it("should update an existing plan", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    const fakePlan = { id: "x", title: "Updated", weeks: [{ id: "w", weekNumber: 1, days: [{ id: "d" }] }], createdAt: "2025-01-01" };
    await expect(
      updatePlan("p1", { title: "Updated", plan: fakePlan as never })
    ).resolves.toBeUndefined();
  });

  it("should throw on update error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "Update failed" } }),
      });
      return chain;
    });

    const fakePlan = { id: "x", title: "Bad", weeks: [{ id: "w", weekNumber: 1, days: [{ id: "d" }] }], createdAt: "2025-01-01" };
    await expect(
      updatePlan("p1", { title: "Bad", plan: fakePlan as never })
    ).rejects.toThrow("Update failed");
  });
});

describe("deletePlan", () => {
  it("should delete a plan", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(deletePlan("p1")).resolves.toBeUndefined();
  });

  it("should throw on delete error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "Delete failed" } }),
      });
      return chain;
    });

    await expect(deletePlan("p1")).rejects.toThrow("Delete failed");
  });
});

describe("countPlans", () => {
  it("should return exact count", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({ count: 3, error: null });
      return chain;
    });

    const result = await countPlans();
    expect(result).toBe(3);
  });

  it("should return 0 on error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({ count: null, error: { message: "Error" } });
      return chain;
    });

    const result = await countPlans();
    expect(result).toBe(0);
  });
});
