import { calcFullCourseTokens } from "@/lib/tokens";
import { z } from "zod";

const schema = z.object({
  weeks: z.number().int().min(3).max(12),
  sessionsPerWeek: z.number().int().min(2).max(6),
  injurySafe: z.boolean(),
  specialEquipment: z.boolean(),
  nutritionTips: z.boolean(),
  pdf: z.enum(["none", "text", "illustrated"]),
  images: z.number().int().min(0).max(40),
  videoPlan: z.boolean()
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  const tokens = calcFullCourseTokens(parsed.data);
  return new Response(JSON.stringify({ tokens }), { status: 200 });
}
