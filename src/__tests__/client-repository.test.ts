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
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  countClients,
} from "@/lib/client-repository";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchClients", () => {
  it("should fetch all clients ordered by name", async () => {
    const clients = [
      { id: "c1", name: "Ana", phone: null, email: null, notes: null, photo_url: null, created_at: "2025-01-01", updated_at: "2025-01-01" },
      { id: "c2", name: "Bruno", phone: "+54", email: "b@x.com", notes: null, photo_url: null, created_at: "2025-01-01", updated_at: "2025-01-01" },
    ];

    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockOrder.mockReturnValue({ data: clients, error: null });
      return chain;
    });

    const result = await fetchClients();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Ana");
    expect(mockFrom).toHaveBeenCalledWith("clients");
  });

  it("should throw on fetch error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockOrder.mockReturnValue({ data: null, error: { message: "Network error" } });
      return chain;
    });

    await expect(fetchClients()).rejects.toThrow("Network error");
  });
});

describe("createClient", () => {
  it("should insert a new client", async () => {
    const newClient = { id: "c-new", name: "Carlos", phone: null, email: null, notes: null, photo_url: null, created_at: "2025-01-01", updated_at: "2025-01-01" };

    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: newClient, error: null }),
        }),
      });
      return chain;
    });

    const result = await createClient({ name: "Carlos" });
    expect(result.name).toBe("Carlos");
  });

  it("should throw on insert error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: null, error: { message: "Duplicate" } }),
        }),
      });
      return chain;
    });

    await expect(createClient({ name: "Bad" })).rejects.toThrow("Duplicate");
  });
});

describe("updateClient", () => {
  it("should update client fields", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(updateClient("c1", { name: "Ana Maria" })).resolves.toBeUndefined();
  });

  it("should throw on update error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockUpdate.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "Update failed" } }),
      });
      return chain;
    });

    await expect(updateClient("c1", { name: "Bad" })).rejects.toThrow("Update failed");
  });
});

describe("deleteClient", () => {
  it("should delete a client", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      });
      return chain;
    });

    await expect(deleteClient("c1")).resolves.toBeUndefined();
  });

  it("should throw on delete error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockDelete.mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "FK constraint" } }),
      });
      return chain;
    });

    await expect(deleteClient("c1")).rejects.toThrow("FK constraint");
  });
});

describe("countClients", () => {
  it("should return exact count", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({ count: 5, error: null });
      return chain;
    });

    const result = await countClients();
    expect(result).toBe(5);
  });

  it("should return 0 on error", async () => {
    mockFrom.mockImplementation(() => {
      const chain = buildChain();
      mockSelect.mockReturnValue({ count: null, error: { message: "Error" } });
      return chain;
    });

    const result = await countClients();
    expect(result).toBe(0);
  });
});
