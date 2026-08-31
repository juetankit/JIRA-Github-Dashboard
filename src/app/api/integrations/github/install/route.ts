import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { signGithubInstallState } from "@/features/github/lib/state";
import { auth } from "@/lib/auth";
import { getCurrentOrganizationForUser } from "@/server/db/queries/organizations";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const organization = await getCurrentOrganizationForUser(session.user.id);

  if (!organization) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/integrations/github?error=no_organization",
        request.url,
      ),
    );
  }

  const slug = process.env.GITHUB_APP_SLUG;

  if (!slug) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/integrations/github?error=not_configured",
        request.url,
      ),
    );
  }

  const state = signGithubInstallState(organization.id);

  const installUrl = new URL(
    `https://github.com/apps/${slug}/installations/new`,
  );
  installUrl.searchParams.set("state", state);

  return NextResponse.redirect(installUrl);
}
