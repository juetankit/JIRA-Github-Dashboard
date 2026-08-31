import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { getCurrentOrganizationForUser } from "@/server/db/queries/organizations";
import { db } from "@/server/db";
import { githubIntegrations } from "@/server/db/schema";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const organization = await getCurrentOrganizationForUser(session.user.id);

  if (organization) {
    await db
      .delete(githubIntegrations)
      .where(eq(githubIntegrations.organizationId, organization.id));
  }

  return NextResponse.redirect(
    new URL(
      "/dashboard/integrations/github?disconnected=1",
      request.url,
    ),
  );
}
