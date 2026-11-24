/** Dados do build injetados pelo next.config.ts (ver readCommitSha) */
export const buildInfo = {
  commit: process.env.NEXT_PUBLIC_COMMIT_SHA ?? "desconhecido",
  ref: process.env.NEXT_PUBLIC_COMMIT_REF ?? "local",
  environment: process.env.NEXT_PUBLIC_DEPLOY_ENV ?? "local",
  builtAt: process.env.NEXT_PUBLIC_BUILD_TIME ?? "",
};

export const REPO_URL = "https://github.com/ffabricioffs/lacrei-desafio";

export function shortCommit(sha: string): string {
  return /^[0-9a-f]{7,40}$/i.test(sha) ? sha.slice(0, 7) : sha;
}
