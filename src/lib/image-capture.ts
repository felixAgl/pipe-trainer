import { toPng } from "html-to-image";

interface CaptureOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

interface CaptureResult {
  dataUrl: string;
}

type ImageCaptureResult =
  | { success: true; data: CaptureResult }
  | { success: false; error: string };

const DEFAULT_OPTIONS = {
  width: 1080,
  height: 1920,
  pixelRatio: 1,
  backgroundColor: "#0a0a0a",
} as const;

export async function captureNode(
  node: HTMLElement,
  options?: CaptureOptions
): Promise<ImageCaptureResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Double render to fix font loading issues with html-to-image
    // First pass warms up the fonts, second pass captures correctly
    await toPng(node, {
      width: opts.width,
      height: opts.height,
      pixelRatio: opts.pixelRatio,
      backgroundColor: opts.backgroundColor,
      cacheBust: true,
    });

    const dataUrl = await toPng(node, {
      width: opts.width,
      height: opts.height,
      pixelRatio: opts.pixelRatio,
      backgroundColor: opts.backgroundColor,
      cacheBust: true,
    });

    return { success: true, data: { dataUrl } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to capture image",
    };
  }
}

export type { CaptureOptions, CaptureResult, ImageCaptureResult };
