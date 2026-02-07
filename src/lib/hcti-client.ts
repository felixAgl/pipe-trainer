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

interface HCTICredentials {
  userId: string;
  apiKey: string;
}

type HCTIResult =
  | { success: true; data: HCTIImageResponse }
  | { success: false; error: HCTIErrorResponse };

const HCTI_API_URL = "https://hcti.io/v1/image";

// Client-side compatible (no process.env, uses btoa instead of Buffer)
export async function generateImage(
  request: HCTIImageRequest,
  credentials: HCTICredentials
): Promise<HCTIResult> {
  if (!credentials.userId || !credentials.apiKey) {
    return {
      success: false,
      error: {
        error: "Missing HCTI credentials. Configure them in settings.",
        statusCode: 400,
      },
    };
  }

  const encoded = btoa(`${credentials.userId}:${credentials.apiKey}`);

  const body = {
    html: request.html,
    css: request.css,
    google_fonts: request.googleFonts ?? "Inter",
    viewport_width: request.viewportWidth ?? 1080,
    viewport_height: request.viewportHeight ?? 1920,
    device_scale: request.deviceScale ?? 2,
  };

  const response = await fetch(HCTI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
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

export type {
  HCTIImageRequest,
  HCTIImageResponse,
  HCTICredentials,
  HCTIResult,
};
