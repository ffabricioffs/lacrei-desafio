import { execSync } from "node:child_process";
import type { NextConfig } from "next";

/**
 * Identificação do build (item 4 da devolutiva): o commit publicado fica
 * visível no rodapé e em /api/versao. Na Vercel vem de VERCEL_GIT_COMMIT_SHA;
 * no GitHub Actions, de GITHUB_SHA; localmente, do próprio git.
 */
function readCommitSha(): string {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return fromEnv;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "desconhecido";
  }
}

const buildInfo = {
  NEXT_PUBLIC_COMMIT_SHA: readCommitSha(),
  NEXT_PUBLIC_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || "local",
  NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV || (process.env.CI ? "ci" : "local"),
  NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
};

/**
 * Cabeçalhos de segurança aplicados a todas as rotas.
 * A Lacrei lida com um público que precisa se sentir seguro: mesmo num
 * desafio, vale mostrar que o front-end também é responsável por isso.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactStrictMode: true,
  env: buildInfo,
  poweredByHeader: false,
  compiler: {
    // Habilita o plugin SWC do styled-components (SSR, displayName e minificação de CSS)
    styledComponents: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
