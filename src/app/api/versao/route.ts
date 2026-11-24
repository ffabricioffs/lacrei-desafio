import { buildInfo, REPO_URL, shortCommit } from "@/lib/buildInfo";

/**
 * GET /api/versao — identifica o build publicado.
 * Usado pelo workflow "Produção" para conferir que a Vercel está servindo
 * exatamente o commit que acabou de ser implantado.
 */
export async function GET() {
  return Response.json(
    {
      commit: buildInfo.commit,
      commitCurto: shortCommit(buildInfo.commit),
      branch: buildInfo.ref,
      ambiente: buildInfo.environment,
      geradoEm: buildInfo.builtAt,
      commitUrl: `${REPO_URL}/commit/${buildInfo.commit}`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
