import { describe, it, expect, vi, beforeEach } from "vitest";
import { captureNode } from "@/lib/image-capture";

vi.mock("html-to-image", () => ({
  toPng: vi.fn(),
}));

describe("captureNode", () => {
  let mockToPng: ReturnType<typeof vi.fn>;
  let mockNode: HTMLElement;

  beforeEach(async () => {
    const htmlToImage = await import("html-to-image");
    mockToPng = htmlToImage.toPng as ReturnType<typeof vi.fn>;
    mockToPng.mockReset();

    mockNode = document.createElement("div");
  });

  it("should return success with dataUrl on successful capture", async () => {
    const fakeDataUrl = "data:image/png;base64,fakecontent";
    // First call: warm-up pass, second call: actual capture
    mockToPng.mockResolvedValueOnce(fakeDataUrl).mockResolvedValueOnce(fakeDataUrl);

    const result = await captureNode(mockNode);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dataUrl).toBe(fakeDataUrl);
    }
  });

  it("should call toPng twice (double render for font loading)", async () => {
    mockToPng.mockResolvedValue("data:image/png;base64,test");

    await captureNode(mockNode);

    expect(mockToPng).toHaveBeenCalledTimes(2);
  });

  it("should pass default options to toPng", async () => {
    mockToPng.mockResolvedValue("data:image/png;base64,test");

    await captureNode(mockNode);

    expect(mockToPng).toHaveBeenCalledWith(mockNode, {
      width: 1080,
      height: 1920,
      pixelRatio: 2,
      backgroundColor: "#0a0a0a",
      cacheBust: true,
    });
  });

  it("should merge custom options with defaults", async () => {
    mockToPng.mockResolvedValue("data:image/png;base64,test");

    await captureNode(mockNode, { width: 800, height: 600 });

    expect(mockToPng).toHaveBeenCalledWith(mockNode, {
      width: 800,
      height: 600,
      pixelRatio: 2,
      backgroundColor: "#0a0a0a",
      cacheBust: true,
    });
  });

  it("should return error on toPng failure", async () => {
    mockToPng.mockRejectedValueOnce(new Error("Canvas tainted"));

    const result = await captureNode(mockNode);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Canvas tainted");
    }
  });

  it("should handle non-Error throws", async () => {
    mockToPng.mockRejectedValueOnce("some string error");

    const result = await captureNode(mockNode);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Failed to capture image");
    }
  });
});
