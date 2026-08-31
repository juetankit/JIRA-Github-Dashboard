import { createHmac, timingSafeEqual } from "node:crypto";

const STATE_TTL_MS = 10 * 60 * 1000;

function getSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not defined");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/**
 * Stateless, signed CSRF token for the GitHub App install flow. Encodes the
 * organization id + a timestamp so the callback can verify the redirect
 * back from GitHub was one we actually issued, without needing a DB row to
 * track in-flight installs.
 */
export function signGithubInstallState(organizationId: string) {
  const payload = `${organizationId}.${Date.now()}`;
  const signature = sign(payload);

  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyGithubInstallState(
  state: string,
): { organizationId: string } | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const [organizationId, timestamp, signature] = decoded.split(".");

    if (!organizationId || !timestamp || !signature) {
      return null;
    }

    const expected = sign(`${organizationId}.${timestamp}`);

    const expectedBuf = Buffer.from(expected, "hex");
    const actualBuf = Buffer.from(signature, "hex");

    if (
      expectedBuf.length !== actualBuf.length ||
      !timingSafeEqual(expectedBuf, actualBuf)
    ) {
      return null;
    }

    if (Date.now() - Number(timestamp) > STATE_TTL_MS) {
      return null;
    }

    return { organizationId };
  } catch {
    return null;
  }
}
