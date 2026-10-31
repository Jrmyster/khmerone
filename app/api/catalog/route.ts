import { apps, gradeLabels } from "@/data/apps";

import { toolGroupId } from "@/lib/tool-groups";

export function GET() {
  return Response.json({ version: 1, apps: apps.map(app => ({ ...app, group: toolGroupId(app.url) })), gradeLabels }, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
