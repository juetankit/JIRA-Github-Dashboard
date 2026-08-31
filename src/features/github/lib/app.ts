import { App } from "octokit";

let app: App | null = null;

function getPrivateKey() {
  const key = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!key) {
    throw new Error("GITHUB_APP_PRIVATE_KEY is not defined");
  }

  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

export function getGithubApp() {
  if (app) {
    return app;
  }

  const appId = process.env.GITHUB_APP_ID;

  if (!appId) {
    throw new Error("GITHUB_APP_ID is not defined");
  }

  app = new App({
    appId,
    privateKey: getPrivateKey(),
  });

  return app;
}

export async function getInstallationOctokit(installationId: number) {
  return getGithubApp().getInstallationOctokit(installationId);
}
