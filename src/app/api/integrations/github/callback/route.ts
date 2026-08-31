import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getGithubApp } from "@/features/github/lib/app";
import { verifyGithubInstallState } from "@/features/github/lib/state";
import { auth } from "@/lib/auth";
import { getCurrentOrganizationForUser } from "@/server/db/queries/organizations";
import { db } from "@/server/db";
import { githubIntegrations } from "@/server/db/schema";

const INTEGRATIONS_PAGE = "/dashboard/integrations/github";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");
  const state = searchParams.get("state");

  const redirectWith = (query: string) =>
    NextResponse.redirect(new URL(`${INTEGRATIONS_PAGE}?${query}`, request.url));

  if (!state) {
    return redirectWith("error=invalid_state");
  }

  const statePayload = verifyGithubInstallState(state);

  if (!statePayload) {
    return redirectWith("error=invalid_state");
  }

  const organization = await getCurrentOrganizationForUser(session.user.id);

  if (!organization || organization.id !== statePayload.organizationId) {
    return redirectWith("error=invalid_state");
  }

  // Installing into an organization that requires admin approval: GitHub
  // sends the requester here with no installation id yet.
  if (setupAction === "request") {
    return redirectWith("pending=1");
  }

  if (!installationId) {
    return redirectWith("error=missing_installation");
  }

  const app = getGithubApp();

  const { data: installation } = await app.octokit.rest.apps.getInstallation({
    installation_id: Number(installationId),
  });

  const account = installation.account;
  const accountLogin =
    account && "login" in account && account.login
      ? account.login
      : account && "slug" in account && account.slug
        ? account.slug
        : "unknown";
  const accountId = account?.id ? String(account.id) : installationId;

  await db
    .insert(githubIntegrations)
    .values({
      organizationId: organization.id,
      githubInstallationId: String(installationId),
      githubAccountId: accountId,
      githubAccountLogin: accountLogin,
    })
    .onConflictDoUpdate({
      target: githubIntegrations.organizationId,
      set: {
        githubInstallationId: String(installationId),
        githubAccountId: accountId,
        githubAccountLogin: accountLogin,
        updatedAt: new Date(),
      },
    });

  return redirectWith("connected=1");
}
