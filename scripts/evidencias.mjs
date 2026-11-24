#!/usr/bin/env node
/**
 * Gera as evidências de um commit em docs/evidencias/<commit-curto>/:
 *
 *  1. testes/       saída completa do Jest + cobertura
 *  2. lighthouse/   relatórios HTML das duas páginas (mobile e desktop)
 *  3. responsividade/  capturas em 6 larguras + checagem de rolagem horizontal
 *  4. marsha.md     estilos MEDIDOS no navegador × valores do Marsha (Figma)
 *  5. contraste.md  contraste MEDIDO no navegador em cada estado (hover/foco)
 *  6. README.md     índice com commit, data e ambiente
 *
 * Uso:  npm run evidencias        (exige árvore git limpa e Chrome instalado)
 * Chrome: variável CHROME_PATH ou /usr/bin/google-chrome
 */
import { execSync, spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const PORT = 3200;
const BASE = `http://localhost:${PORT}`;
const sh = (cmd, opts = {}) => (execSync(cmd, { encoding: "utf8", ...opts }) ?? "").trim();

// ---------- 0. Identificação do commit ----------
const commit = sh("git rev-parse HEAD");
const short = commit.slice(0, 7);
const dirty = sh("git status --porcelain -- src public package.json package-lock.json next.config.ts");
if (dirty && !process.env.PERMITIR_ARVORE_SUJA) {
  console.error("Há mudanças não commitadas no código. Faça commit antes de gerar evidências.");
  process.exit(1);
}
const OUT = join("docs", "evidencias", short);
rmSync(OUT, { recursive: true, force: true });
["testes", "lighthouse", "responsividade", "marsha"].forEach((d) => mkdirSync(join(OUT, d), { recursive: true }));
const now = new Date().toISOString();
const chromeVersion = sh(`"${CHROME}" --version`);
const nodeVersion = process.version;
console.log(`Evidências do commit ${commit} → ${OUT}`);

// ---------- 1. Testes ----------
console.log("1/5 Testes…");
let jestOut;
try {
  jestOut = sh("npx jest --ci --verbose --coverage --coverageReporters=text --coverageReporters=text-summary 2>&1", {
    maxBuffer: 20 * 1024 * 1024,
  });
} catch (error) {
  jestOut = `${error.stdout ?? ""}${error.stderr ?? ""}`;
  console.error("Testes falharam — a saída foi salva mesmo assim.");
}
writeFileSync(join(OUT, "testes", "jest-saida.txt"), `# Commit ${commit}\n# Gerado em ${now}\n\n${jestOut}\n`);
const jestSummary = (jestOut.match(/^(Test Suites|Tests):.*$/gm) || []).join("\n");

// ---------- 2. Build e servidor ----------
console.log("2/5 Build de produção…");
sh("npx next build", { env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: "ignore" });
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
const stopServer = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
process.on("exit", stopServer);
for (let i = 0; i < 60; i++) {
  try {
    await fetch(`${BASE}/api/versao`);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
const served = await (await fetch(`${BASE}/api/versao`)).json();
if (served.commit !== commit) throw new Error(`Servidor serve ${served.commit}, esperado ${commit}`);

// ---------- 3. Lighthouse ----------
console.log("3/5 Lighthouse…");
const PAGES = [
  { path: "/", name: "inicio" },
  { path: "/profissionais", name: "profissionais" },
];
const lhRows = [];
for (const page of PAGES) {
  for (const preset of ["mobile", "desktop"]) {
    const base = join(OUT, "lighthouse", `${page.name}-${preset}`);
    const flag = preset === "desktop" ? "--preset=desktop" : "";
    sh(
      `npx -y lighthouse@13 ${BASE}${page.path} --quiet ${flag} --output=html --output=json --output-path=${base} ` +
        `--chrome-path="${CHROME}" --chrome-flags="--headless=new --no-sandbox" ` +
        `--only-categories=performance,accessibility,best-practices,seo`,
      { stdio: "ignore", maxBuffer: 50 * 1024 * 1024 },
    );
    const lhr = JSON.parse(sh(`cat ${base}.report.json`, { maxBuffer: 50 * 1024 * 1024 }));
    rmSync(`${base}.report.json`); // mantemos o HTML (relatório completo) e o resumo abaixo
    const s = (k) => Math.round(lhr.categories[k].score * 100);
    lhRows.push({
      page: page.path,
      preset,
      perf: s("performance"),
      a11y: s("accessibility"),
      bp: s("best-practices"),
      seo: s("seo"),
      lcp: lhr.audits["largest-contentful-paint"].displayValue,
      cls: lhr.audits["cumulative-layout-shift"].displayValue,
      tbt: lhr.audits["total-blocking-time"].displayValue,
      file: `lighthouse/${page.name}-${preset}.report.html`,
      version: lhr.lighthouseVersion,
    });
  }
}

// ---------- 4. Navegador: responsividade, Marsha e contraste ----------
console.log("4/5 Responsividade, Marsha e contraste…");
const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox", "--headless=new"] });
const tab = await browser.newPage();
// Sem animações: as transições de cor (0,15s) terminariam depois da leitura do estilo
await tab.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
const settle = () => new Promise((r) => setTimeout(r, 150));
const hover = async (sel) => {
  await tab.hover(sel);
  await settle();
};

/** Contraste WCAG entre duas cores rgb()/rgba() já resolvidas */
const parseRgb = (str) => str.match(/[\d.]+/g).slice(0, 3).map(Number);
const lum = ([r, g, b]) =>
  [r, g, b]
    .map((v) => v / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [l1, l2] = [lum(parseRgb(a)), lum(parseRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// 4a. Responsividade
const WIDTHS = [360, 375, 414, 768, 1024, 1440];
const respRows = [];
for (const page of PAGES) {
  for (const width of WIDTHS) {
    await tab.setViewport({ width, height: 900 });
    await tab.goto(`${BASE}${page.path}`, { waitUntil: "networkidle0" });
    const info = await tab.evaluate(() => {
      const doc = document.documentElement;
      const toggle = document.querySelector("button[aria-controls]");
      const smallTargets = [...document.querySelectorAll("a, button, input, select")]
        .filter((el) => el.offsetParent !== null && !el.classList.contains("visually-hidden"))
        .filter((el) => getComputedStyle(el).position !== "absolute" || el.offsetWidth > 1)
        // Links dentro de um parágrafo de texto são a exceção "inline" do WCAG 2.5.8 e não contam.
        .filter((el) => !(el.tagName === "A" && el.parentElement?.tagName === "P"))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 1 && (r.height < 24 || r.width < 24)).length;
      return {
        overflow: doc.scrollWidth > window.innerWidth,
        scrollWidth: doc.scrollWidth,
        menu: toggle && getComputedStyle(toggle).display !== "none" ? "botão de menu" : "menu completo",
        h1: Math.round(parseFloat(getComputedStyle(document.querySelector("h1")).fontSize)),
        smallTargets,
      };
    });
    const file = `responsividade/${page.name}-${width}.jpg`;
    await tab.screenshot({ path: join(OUT, file), fullPage: true, type: "jpeg", quality: 70 });
    respRows.push({ page: page.path, width, ...info, file });
  }
}

// 4b. Conferência com o Marsha (valores do Figma → estilo computado)
const css = (selector, props, state) =>
  tab.evaluate(
    (sel, ps, st) => {
      const el = typeof sel === "string" ? document.querySelector(sel) : null;
      if (!el) return null;
      const s = getComputedStyle(el, st === "::before" ? "::before" : null);
      const r = el.getBoundingClientRect();
      return Object.fromEntries(ps.map((p) => [p, p === "height" ? `${Math.round(r.height)}px` : s.getPropertyValue(p)]));
    },
    selector,
    props,
    state,
  );

const C = {
  emerald60: "rgb(1, 135, 98)",
  emerald70: "rgb(0, 119, 86)",
  emerald80: "rgb(1, 76, 55)",
  emerald50: "rgb(41, 164, 128)",
  emerald20: "rgb(178, 223, 208)",
  gray80: "rgb(19, 19, 19)",
  gray70: "rgb(45, 45, 45)",
  gray60: "rgb(81, 81, 81)",
  gray40: "rgb(191, 191, 191)",
  emerald10: "rgb(223, 242, 237)",
  blue60: "rgb(40, 88, 138)",
  white: "rgb(255, 255, 255)",
};

const checks = [];
const check = (group, item, figma, actual, expected) =>
  checks.push({ group, item, figma, actual, expected, ok: actual?.includes?.(expected) || actual === expected });

async function measure(width, path) {
  await tab.setViewport({ width, height: 900 });
  await tab.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
  await tab.mouse.move(0, 0);
}

// Tipografia e cores base
for (const [width, h1, h2] of [
  [375, "32px", "24px"],
  [1440, "48px", "40px"],
]) {
  await measure(width, "/");
  const b = await css("body", ["font-family", "color", "font-size", "line-height"]);
  const t1 = await css("h1", ["font-size", "font-weight", "color", "line-height"]);
  const t2 = await css("#como-funciona-titulo", ["font-size", "font-weight", "color"]);
  const label = `${width}px`;
  if (width === 375) {
    check("Tipografia", "Fonte do corpo", "Nunito", b["font-family"], "Nunito");
    check("Tipografia", "Cor do corpo", "Text/body #2D2D2D", b.color, C.gray70);
    check("Tipografia", "Corpo Text-base", "16px / 150%", `${b["font-size"]} / ${b["line-height"]}`, "16px / 24px");
  }
  check("Tipografia", `h1 Headline-xl (${label})`, `${h1} Bold`, `${t1["font-size"]} ${t1["font-weight"]}`, `${h1} 700`);
  check("Tipografia", `h1 cor (${label})`, "Text/heading #131313", t1.color, C.gray80);
  check("Tipografia", `h2 Headline-lg (${label})`, `${h2} Bold`, `${t2["font-size"]} ${t2["font-weight"]}`, `${h2} 700`);
}

// Botões (handoff ButtonDefault)
await measure(1440, "/");
const primary = 'main a[href="/profissionais"]';
const secondary = 'main a[href="#como-funciona"]';
let p = await css(primary, ["background-color", "color", "height", "border-radius", "font-size", "font-weight", "padding", "box-shadow"]);
check("Botão primário", "Fundo", "accent #018762", p["background-color"], C.emerald60);
check("Botão primário", "Texto", "invert #FFFFFF", p.color, C.white);
check("Botão primário", "Altura", "48px", p.height, "48px");
check("Botão primário", "Raio", "8px", p["border-radius"], "8px");
check("Botão primário", "Fonte", "18px Bold", `${p["font-size"]} ${p["font-weight"]}`, "18px 700");
check("Botão primário", "Padding horizontal", "32px (altura fixa de 48px)", `${p.padding.split(" ")[1]}`, "32px");
check("Botão primário", "Sombra", "0 5px 5px rgba(0,0,0,.3)", p["box-shadow"], "rgba(0, 0, 0, 0.3) 0px 5px 5px");
await hover(primary);
p = await css(primary, ["background-color"]);
check("Botão primário", "Hover: fundo", "accent-hover #007756", p["background-color"], C.emerald70);

await tab.mouse.move(0, 0);
let s2 = await css(secondary, ["background-color", "color", "border-top-color", "border-top-width"]);
check("Botão secundário", "Borda", "2px #018762", `${s2["border-top-width"]} ${s2["border-top-color"]}`, `2px ${C.emerald60}`);
check("Botão secundário", "Texto", "accent #018762", s2.color, C.emerald60);
await hover(secondary);
s2 = await css(secondary, ["background-color", "color", "border-top-color"]);
check("Botão secundário", "Hover: fundo", "success-hover #B2DFD0", s2["background-color"], C.emerald20);
check("Botão secundário", "Hover: borda", "border-hover #29A480", s2["border-top-color"], C.emerald50);
check(
  "Botão secundário",
  "Hover: texto (ajuste de contraste)",
  "Figma #007756 → ajustado #014C37",
  s2.color,
  C.emerald80,
);

// Foco por teclado
await measure(1440, "/");
for (const [presses, label] of [
  [2, "logo"],
  [6, "botão primário"],
]) {
  await measure(1440, "/");
  for (let i = 0; i < presses; i++) await tab.keyboard.press("Tab");
  await settle();
  const focusRing = await tab.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor} / offset ${s.outlineOffset}`;
  });
  check("Foco", `Anel de foco (${label}, via Tab)`, "2px blue-60 #28588A, afastado 4px", focusRing, `2px solid ${C.blue60} / offset 4px`);
}
await measure(1440, "/");

// Header
const hdr = await css("header", ["height", "background-image"]);
check("Header", "Altura (desktop)", "96px", hdr.height, "96px");
check("Header", "Fundo", "gradient-subtle #F5FFFB → #FFFFFF", hdr["background-image"], "rgb(245, 255, 251)");
const nav = 'header nav a[href="/profissionais"]';
let n = await css(nav, ["color", "font-size", "font-weight", "height"]);
check("Header", "Link: fonte", "Button Link 18px Bold", `${n["font-size"]} ${n["font-weight"]}`, "18px 700");
check("Header", "Link: altura mínima", "48px", n.height, "48px");
check("Header", "Link: texto (ajuste de contraste)", "Figma #018762 → ajustado #007756", n.color, C.emerald70);
await hover(nav);
n = await css(nav, ["color", "background-color"]);
check("Header", "Link hover: fundo", "#B2DFD0", n["background-color"], C.emerald20);
check("Header", "Link hover: texto (ajuste de contraste)", "Figma #007756 → ajustado #014C37", n.color, C.emerald80);
const logo = await tab.evaluate(() => document.querySelector("header img")?.getAttribute("src"));
check("Header", "Logo oficial", "logotipo horizontal (SVG do Figma)", logo, "/brand/logo-lacrei-horizontal.svg");
await measure(375, "/");
const hdrM = await css("header", ["height"]);
check("Header", "Altura (mobile)", "96px", hdrM.height, "96px");

// Footer
await measure(1440, "/");
const hr = await css("footer hr", ["border-top-color", "border-top-width"]);
check("Footer", "Divisória", "1px emerald-20 #B2DFD0", `${hr["border-top-width"]} ${hr["border-top-color"]}`, `1px ${C.emerald20}`);
const ft = await css("footer h2", ["font-size", "font-weight", "color"]);
check("Footer", "Título de coluna", "Text-xl-highlight 18px Bold #131313", `${ft["font-size"]} ${ft["font-weight"]} ${ft.color}`, `18px 700 ${C.gray80}`);
const fl = await css("footer nav li a", ["font-size", "color", "height"]);
check("Footer", "Link (Secondary link)", "16px #2D2D2D, mín. 48px", `${fl["font-size"]} ${fl.color} ${fl.height}`, `16px ${C.gray70} 48px`);
const btt = await css('footer a[href="#topo"]', ["border-top-color", "height"]);
check("Footer", "Voltar ao topo", "Outline/Icon 48px, borda #29A480", `${btt.height} ${btt["border-top-color"]}`, `48px ${C.emerald50}`);
const flogo = await tab.evaluate(() => document.querySelector("footer img")?.getAttribute("src"));
check("Footer", "Logo empilhado", "SVG do Figma", flogo, "/brand/logo-lacrei-empilhado.svg");

// Acordeão
const acc = await css('section[aria-labelledby="faq-titulo"] h3 button', ["font-size", "font-weight", "color"]);
check("Accordion", "Título", "text-base-highlight 16px Bold, text-body", `${acc["font-size"]} ${acc["font-weight"]} ${acc.color}`, `16px 700 ${C.gray70}`);
const accItem = await tab.evaluate(() => {
  const s = getComputedStyle(document.querySelector('section[aria-labelledby="faq-titulo"] h3').parentElement);
  return `${s.borderTopColor} ${s.borderTopLeftRadius}`;
});
check("Accordion", "Borda do item", "Border/card #BFBFBF, raio 8px", accItem, `${C.gray40} 8px`);

// Busca: input e tag
await measure(1440, "/profissionais");
let inp = await css('input[type="search"]', ["border-top-width", "border-top-color", "border-radius", "height"]);
check("Input", "Padrão", "borda 2px, raio 8px, 48px", `${inp["border-top-width"]} ${inp["border-radius"]} ${inp.height}`, "2px 8px 48px");
await tab.type('input[type="search"]', "psico");
await tab.mouse.move(0, 0);
inp = await css('input[type="search"]', ["border-top-color"]);
check("Input", "Preenchido", "color-border-hover #29A480", inp["border-top-color"], C.emerald50);
const tag = await css("article ul li", ["background-color", "border-radius", "font-size"]);
check("Tag", "Etiqueta do card", "fundo #DFF2ED, cantos 4px, 14px", `${tag["background-color"]} ${tag["border-radius"]} ${tag["font-size"]}`, `${C.emerald10} 4px 14px`);

// 4c. Contraste medido no navegador em cada estado
const contrastTargets = [
  { page: "/", width: 1440, sel: 'main a[href="/profissionais"]', name: "Botão primário" },
  { page: "/", width: 1440, sel: 'main a[href="#como-funciona"]', name: "Botão secundário" },
  { page: "/", width: 1440, sel: 'header nav a[href="/profissionais"]', name: "Link do menu (header)" },
  { page: "/", width: 1440, sel: 'header nav a[href="/"]', name: "Link do menu ativo (Início)" },
  { page: "/", width: 1440, sel: 'section[aria-labelledby="publico-titulo"] a[href^="https://profissional"]', name: "Botão secundário (card Profissionais)" },
  { page: "/", width: 1440, sel: "footer nav li a", name: "Link do rodapé" },
  { page: "/", width: 1440, sel: 'section[aria-labelledby="faq-titulo"] h3 button', name: "Pergunta do acordeão" },
  { page: "/profissionais", width: 1440, sel: "article button", name: "Botão Ver detalhes (secundário)" },
  { page: "/profissionais", width: 1440, sel: 'form button[type="submit"]', name: "Botão Buscar (primário)" },
  {
    page: "/profissionais",
    width: 1440,
    sel: '[data-evidencia="ghost"]',
    name: "Botão Limpar filtros (ghost)",
    // O botão ghost só aparece com um filtro ativo: escolhe "Online" e marca o botão para medir.
    prepare: async () => {
      await tab.click('input[type="radio"][value="online"]');
      await tab.waitForFunction(() =>
        [...document.querySelectorAll("button")].some((b) => b.textContent.trim() === "Limpar filtros"),
      );
      await tab.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "Limpar filtros");
        b.setAttribute("data-evidencia", "ghost");
      });
      await tab.mouse.move(0, 0);
      await settle();
    },
  },
  { page: "/profissionais", width: 375, sel: 'header button[aria-controls]', name: "Botão do menu mobile", icon: true },
];
const contrastRows = [];
for (const target of contrastTargets) {
  for (const state of ["padrão", "hover", "foco"]) {
    await measure(target.width, target.page);
    if (target.prepare) await target.prepare();
    if (state === "hover") await hover(target.sel);
    if (state === "foco") {
      await tab.focus(target.sel);
      await settle();
    }
    const colors = await tab.evaluate((sel) => {
      const el = document.querySelector(sel);
      const fg = getComputedStyle(el).color;
      let node = el;
      let bg = "rgba(0, 0, 0, 0)";
      while (node) {
        const s = getComputedStyle(node);
        if (s.backgroundColor !== "rgba(0, 0, 0, 0)" && !s.backgroundColor.endsWith(", 0)")) {
          bg = s.backgroundColor;
          break;
        }
        // Fundo em degradê (header): usa a cor mais clara, o pior caso para texto escuro sobre claro
        const grad = s.backgroundImage.match(/rgb\([^)]+\)/);
        if (grad) {
          bg = grad[0];
          break;
        }
        node = node.parentElement;
      }
      return { fg, bg: bg === "rgba(0, 0, 0, 0)" ? "rgb(255, 255, 255)" : bg };
    }, target.sel);
    const value = ratio(colors.fg, colors.bg);
    const min = target.icon ? 3 : 4.5;
    contrastRows.push({ ...target, state, ...colors, value, min, ok: value >= min });
  }
}

// Ganchos visuais dos componentes (para comparar lado a lado com o Figma)
await measure(1440, "/");
const shot = async (sel, file, prepare) => {
  if (prepare) await prepare();
  const el = await tab.$(sel);
  await el.screenshot({ path: join(OUT, "marsha", file) });
};
await shot("header", "header-desktop.png");
await shot("footer", "footer-desktop.png");
await hover(secondary);
await shot("main section", "hero-botoes-hover-secundario.png");
await tab.mouse.move(0, 0);
await tab.evaluate(() => document.querySelector('section[aria-labelledby="faq-titulo"] h3 button').click());
await shot('section[aria-labelledby="faq-titulo"]', "acordeao-aberto.png");
await measure(1440, "/profissionais");
await shot("form", "busca-formulario.png");
await shot("article", "card-profissional.png");
await measure(375, "/");
await shot("header", "header-mobile.png");
await tab.click('header button[aria-controls]');
await shot("header", "header-mobile-menu-aberto.png");
await measure(375, "/");
await shot("footer", "footer-mobile.png");

await browser.close();
stopServer();

// ---------- 5. Relatórios em Markdown ----------
console.log("5/5 Relatórios…");
const yes = (ok) => (ok ? "✅" : "❌");
const marshaOk = checks.every((c) => c.ok);
const contrastOk = contrastRows.every((c) => c.ok);
const respOk = respRows.every((r) => !r.overflow);

writeFileSync(
  join(OUT, "marsha.md"),
  `# Conferência com o Marsha Design System — commit \`${short}\`

Cada linha compara o **valor do guia** (Figma: variáveis e handoff) com o **estilo computado medido no Chrome** (\`getComputedStyle\`), no build de produção deste commit.
Gerado em ${now} por \`npm run evidencias\`.

| Componente | Item | Guia (Figma) | Medido | Resultado |
| --- | --- | --- | --- | --- |
${checks.map((c) => `| ${c.group} | ${c.item} | ${c.figma} | \`${c.actual}\` | ${yes(c.ok)} |`).join("\n")}

**${checks.filter((c) => c.ok).length} de ${checks.length} itens conferem.**

Os três itens marcados "ajuste de contraste" diferem do Figma **de propósito**: no guia, o texto
\`#007756\` sobre \`#B2DFD0\` (hover do Outline e do Button Link) tem 3,81:1, abaixo do AA (4,5:1).
Mantivemos o fundo do guia e usamos \`#014C37\` (6,87:1). No header, o texto padrão do link usa
\`#007756\` (5,45:1 sobre \`#F5FFFB\`), porque \`#018762\` sobre o degradê do header fica em 4,43:1.

## Capturas dos componentes (build deste commit)

| Componente | Arquivo |
| --- | --- |
| Header desktop | [marsha/header-desktop.png](marsha/header-desktop.png) |
| Header mobile (fechado / aberto) | [marsha/header-mobile.png](marsha/header-mobile.png) · [marsha/header-mobile-menu-aberto.png](marsha/header-mobile-menu-aberto.png) |
| Footer desktop / mobile | [marsha/footer-desktop.png](marsha/footer-desktop.png) · [marsha/footer-mobile.png](marsha/footer-mobile.png) |
| Botões (hover no secundário) | [marsha/hero-botoes-hover-secundario.png](marsha/hero-botoes-hover-secundario.png) |
| Accordion aberto | [marsha/acordeao-aberto.png](marsha/acordeao-aberto.png) |
| Input + filtros | [marsha/busca-formulario.png](marsha/busca-formulario.png) |
| Card com Tags | [marsha/card-profissional.png](marsha/card-profissional.png) |

Referências no Figma (arquivo \`P4fEHULnr9okeGIT7p3P0G\`): Cores \`16298:3\`, Tipografia \`16298:82\`,
Pontos de quebra \`16791:12099\`, Button \`600:68\`, Header \`12126:7710\`, Footer \`12126:7709\`,
Accordion \`19362:4215\`, Input \`602:74\`, Tags \`29704:1100\`.
`,
);

writeFileSync(
  join(OUT, "contraste.md"),
  `# Contraste medido no navegador — commit \`${short}\`

Para cada elemento interativo, o script aplica o estado (padrão, hover com o mouse, foco por teclado),
lê \`color\` e o fundo efetivo (primeiro ancestral com fundo; em degradê, a cor mais clara) e calcula a razão WCAG 2.1.
Mínimo: 4,5:1 para texto e 3:1 para ícones. Gerado em ${now}.

| Elemento | Página / largura | Estado | Texto | Fundo | Contraste | Mínimo | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- |
${contrastRows
  .map(
    (r) =>
      `| ${r.name} | \`${r.page}\` ${r.width}px | ${r.state} | \`${r.fg}\` | \`${r.bg}\` | ${r.value.toFixed(2)}:1 | ${r.min}:1 | ${yes(r.ok)} |`,
  )
  .join("\n")}

Além desta medição, o teste unitário \`src/styles/interactionStates.test.ts\` verifica **todos** os pares de cor
de estados interativos definidos no código (botões, links, ícones, acordeão, filtros, menu e anel de foco).
`,
);

writeFileSync(
  join(OUT, "README.md"),
  `# Evidências do commit \`${short}\`

- **Commit avaliado:** [\`${commit}\`](https://github.com/ffabricioffs/lacrei-desafio/commit/${commit})
- **Gerado em:** ${now}
- **Ambiente:** ${chromeVersion} · Node ${nodeVersion} · Lighthouse ${lhRows[0]?.version} · build de produção (\`next build\` + \`next start\`) servido localmente
- **Como reproduzir:** \`npm ci && npm run evidencias\` (gera esta pasta para o commit atual)

> Estes números são do build de produção rodando **localmente**. As medições no domínio público da
> Vercel são feitas automaticamente pelo workflow [Produção](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml)
> a cada deploy (ver o resumo de cada execução).

## 1. Testes

\`\`\`
${jestSummary}
\`\`\`

Saída completa, com a lista de todos os testes e a cobertura: [testes/jest-saida.txt](testes/jest-saida.txt)

## 2. Lighthouse (duas páginas, mobile e desktop)

| Página | Perfil | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT | Relatório |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${lhRows
  .map(
    (r) =>
      `| \`${r.page}\` | ${r.preset} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | [HTML](${r.file}) |`,
  )
  .join("\n")}

Os arquivos HTML são os relatórios completos do Lighthouse (abra no navegador após baixar).

## 3. Responsividade ${yes(respOk)}

| Página | Largura | Rolagem horizontal | Navegação | \`h1\` | Alvos < 24px | Captura |
| --- | --- | --- | --- | --- | --- | --- |
${respRows
  .map(
    (r) =>
      `| \`${r.page}\` | ${r.width}px | ${r.overflow ? `❌ (${r.scrollWidth}px)` : "não"} | ${r.menu} | ${r.h1}px | ${r.smallTargets} | [jpg](${r.file}) |`,
  )
  .join("\n")}

Larguras escolhidas pelos pontos de quebra do Marsha: mobile 360/375/414, tablet 768, desktop 1024/1440.
"Alvos < 24px" conta links, botões e campos visíveis menores que 24 × 24px (WCAG 2.5.8). Links no meio de
um parágrafo (ex.: cvv.org.br, commit no rodapé) ficam de fora por serem a exceção de texto corrido.

## 4. Conferência com o Marsha ${yes(marshaOk)}

${checks.filter((c) => c.ok).length} de ${checks.length} itens medidos conferem com o guia. Tabela completa: [marsha.md](marsha.md)

## 5. Contraste medido em cada estado ${yes(contrastOk)}

${contrastRows.filter((r) => r.ok).length} de ${contrastRows.length} medições atingem o mínimo WCAG AA. Tabela completa: [contraste.md](contraste.md)
`,
);

console.log(`Pronto: ${OUT}`);
console.log(`Testes: ${jestSummary.replace(/\n/g, " | ")}`);
console.log(`Marsha: ${checks.filter((c) => c.ok).length}/${checks.length} · Contraste: ${contrastRows.filter((r) => r.ok).length}/${contrastRows.length} · Responsivo: ${respOk}`);
checks.filter((c) => !c.ok).forEach((c) => console.log(`  ❌ ${c.group} / ${c.item}: ${c.actual} (esperado ${c.expected})`));
contrastRows.filter((c) => !c.ok).forEach((c) => console.log(`  ❌ ${c.name} ${c.state}: ${c.value.toFixed(2)}`));
respRows.filter((r) => r.overflow).forEach((r) => console.log(`  ❌ overflow ${r.page} ${r.width}`));
process.exit(0);
