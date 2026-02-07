import { NextRequest, NextResponse } from "next/server";
import type { WorkoutDay } from "@/types/workout";
import { buildWorkoutDayHTML, buildWorkoutDayCSS } from "@/lib/template-builder";
import { generateImage } from "@/lib/hcti-client";

interface GenerateImageBody {
  day: WorkoutDay;
  weekNumber: number;
}

interface GenerateBatchBody {
  days: WorkoutDay[];
  weekNumber: number;
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const batch = url.searchParams.get("batch") === "true";

  if (batch) {
    return handleBatchGeneration(request);
  }

  return handleSingleGeneration(request);
}

async function handleSingleGeneration(request: NextRequest) {
  const body = (await request.json()) as GenerateImageBody;

  if (!body.day || !body.weekNumber) {
    return NextResponse.json(
      { error: "Missing required fields: day, weekNumber" },
      { status: 400 }
    );
  }

  const html = buildWorkoutDayHTML(body.day, {
    weekNumber: body.weekNumber,
  });
  const css = buildWorkoutDayCSS();

  const result = await generateImage({ html, css });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.error },
      { status: result.error.statusCode }
    );
  }

  return NextResponse.json({ url: result.data.url });
}

async function handleBatchGeneration(request: NextRequest) {
  const body = (await request.json()) as GenerateBatchBody;

  if (!body.days || !body.weekNumber) {
    return NextResponse.json(
      { error: "Missing required fields: days, weekNumber" },
      { status: 400 }
    );
  }

  const css = buildWorkoutDayCSS();

  const results = await Promise.allSettled(
    body.days.map(async (day) => {
      const html = buildWorkoutDayHTML(day, {
        weekNumber: body.weekNumber,
      });

      const result = await generateImage({ html, css });

      if (!result.success) {
        throw new Error(result.error.error);
      }

      return {
        dayNumber: day.dayNumber,
        dayLabel: day.dayLabel,
        muscleGroup: day.muscleGroup,
        url: result.data.url,
      };
    })
  );

  const images = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return { success: true as const, ...result.value };
    }
    return {
      success: false as const,
      dayNumber: body.days[index].dayNumber,
      error: result.reason instanceof Error ? result.reason.message : "Unknown error",
    };
  });

  return NextResponse.json({ images });
}
