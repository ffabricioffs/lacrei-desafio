#!/usr/bin/env node
/**
 * Gera um resumo em Markdown dos relatórios do Lighthouse CI.
 * Uso: node scripts/lhci-resumo.mjs <pasta-do-upload-filesystem> <titulo> [links.json]
 *
 * - <pasta>: saída de `lhci upload --target=filesystem` (contém manifest.json)
 * - [links.json]: `.lighthouseci/links.json`, criado no upload para
 *   temporary-public-storage (links públicos dos relatórios)
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [dir, title = "Lighthouse", linksPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
const links = linksPath && existsSync(linksPath) ? JSON.parse(readFileSync(linksPath, "utf8")) : {};

const pct = (v) => (typeof v === "number" ? Math.round(v * 100) : "—");
const rows = manifest
  .filter((run) => run.isRepresentativeRun)
  .map((run) => {
    const s = run.summary;
    const link = links[run.url] ? `[relatório](${links[run.url]})` : "artefato";
    return `| ${run.url} | ${pct(s.performance)} | ${pct(s.accessibility)} | ${pct(s["best-practices"])} | ${pct(s.seo)} | ${link} |`;
  });

const commit = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : "local";
console.log(`### ${title}\n`);
console.log(`Commit avaliado: \`${commit}\` · execução representativa (mediana de ${manifest.length / Math.max(rows.length, 1)} execuções por URL)\n`);
console.log("| URL | Performance | Acessibilidade | Boas práticas | SEO | Relatório |");
console.log("| --- | --- | --- | --- | --- | --- |");
rows.forEach((row) => console.log(row));
