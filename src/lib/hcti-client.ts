interface HCTIImageRequest {
  html: string;
  css: string;
  googleFonts?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  deviceScale?: number;
}

interface HCTIImageResponse {
  url: string;
}

interface HCTIErrorResponse {
  error: string;
  statusCode: number;
}

type HCTIResult =
  | { success: true; data: HCTIImageResponse }
  | { success: false; error: HCTIErrorResponse };

const HCTI_API_URL = "https://hcti.io/v1/image";

export async function generateImage(
  request: HCTIImageRequest
): Promise<HCTIResult> {
  const userId = process.env.HCTI_USER_ID;
  const apiKey = process.env.HCTI_API_KEY;

  if (!userId || !apiKey) {
    return {
      success: false,
      error: {
        error: "Missing HCTI_USER_ID or HCTI_API_KEY environment variables",
        statusCode: 500,
      },
    };
  }

  const credentials = Buffer.from(`${userId}:${apiKey}`).toString("base64");

  const body = {
    html: request.html,
    css: request.css,
    google_fonts: request.googleFonts ?? "Inter",
    viewport_width: request.viewportWidth ?? 1080,
    device_scale: request.deviceScale ?? 2,
  };

  const response = await fetch(HCTI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: {
        error: `HCTI API error: ${errorText}`,
        statusCode: response.status,
      },
    };
  }

  const data = (await response.json()) as HCTIImageResponse;

  return { success: true, data };
}

export type { HCTIImageRequest, HCTIImageResponse, HCTIResult };
