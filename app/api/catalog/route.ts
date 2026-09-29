import { apps, gradeLabels } from "@/data/apps";

export function GET() {
  return Response.json({ version: 1, apps, gradeLabels }, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
