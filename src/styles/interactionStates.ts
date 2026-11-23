import { theme } from "./theme";

const c = theme.colors;

/**
 * Pares de cor (texto/ícone × fundo) de TODOS os estados interativos.
 *
 * Fonte única: os componentes leem daqui e o teste
 * `interactionStates.test.ts` calcula o contraste WCAG de cada par.
 *
 * Regra (WCAG 2.1, 1.4.3 e 1.4.11):
 * - `text`: texto ≥ 4,5:1 (18px Bold não chega a "texto grande", que exige 18,66px Bold)
 * - `nonText`: ícones e componentes gráficos ≥ 3:1
 *
 * Ajuste em relação ao Figma (devolutiva da Lacrei, 23/11/2026):
 * o Marsha define hover do Outline/Link como texto emerald-70 (#007756) sobre
 * emerald-20 (#B2DFD0) = 3,81:1. Mantivemos o fundo do guia e escurecemos o
 * texto para emerald-80 (#014C37) = 6,80:1, o mesmo tom do estado pressionado.
 */
export interface ColorPair {
  fg: string;
  bg: string;
  kind: "text" | "nonText";
  /** Onde o par aparece, para o relatório de contraste */
  where: string;
}

/** Pior caso do fundo do header (gradient-subtle começa em #F5FFFB) */
export const HEADER_SURFACE = "#F5FFFB";

export const interactionStates = {
  buttonPrimary: {
    default: { fg: c.white, bg: c.primary, kind: "text", where: "Botão primário" },
    hover: { fg: c.white, bg: c.primaryHover, kind: "text", where: "Botão primário (hover)" },
    active: { fg: c.white, bg: c.primaryActive, kind: "text", where: "Botão primário (pressionado)" },
  },
  buttonSecondary: {
    default: { fg: c.primary, bg: c.white, kind: "text", where: "Botão secundário" },
    hover: { fg: c.primaryActive, bg: c.primaryLight, kind: "text", where: "Botão secundário (hover)" },
    active: {
      fg: c.primaryActive,
      bg: c.primaryPressedSurface,
      kind: "text",
      where: "Botão secundário (pressionado)",
    },
  },
  buttonGhost: {
    default: { fg: c.primary, bg: c.white, kind: "text", where: "Botão ghost (ex.: Limpar filtros)" },
    hover: { fg: c.primaryActive, bg: c.primaryLight, kind: "text", where: "Botão ghost (hover)" },
    active: {
      fg: c.primaryActive,
      bg: c.primaryPressedSurface,
      kind: "text",
      where: "Botão ghost (pressionado)",
    },
  },
  navLink: {
    // No header o fundo é esverdeado: emerald-60 daria ~4,4:1, então usamos emerald-70
    default: { fg: c.primaryHover, bg: HEADER_SURFACE, kind: "text", where: "Link do menu (header)" },
    hover: { fg: c.primaryActive, bg: c.primaryLight, kind: "text", where: "Link do menu (hover)" },
    mobilePanel: { fg: c.primaryHover, bg: c.white, kind: "text", where: "Link do menu (painel mobile)" },
  },
  footerLink: {
    default: { fg: c.text, bg: c.white, kind: "text", where: "Link do rodapé" },
    hover: { fg: c.primaryActive, bg: c.white, kind: "text", where: "Link do rodapé (hover)" },
  },
  socialIcon: {
    default: { fg: c.primary, bg: c.white, kind: "nonText", where: "Ícone de rede social" },
    hover: { fg: c.primary, bg: c.primarySurface, kind: "nonText", where: "Ícone de rede social (hover)" },
    active: { fg: c.primary, bg: c.primaryLight, kind: "nonText", where: "Ícone de rede social (pressionado)" },
  },
  backToTop: {
    default: { fg: c.heading, bg: c.white, kind: "nonText", where: "Voltar ao topo" },
    hover: { fg: c.heading, bg: c.primaryLight, kind: "nonText", where: "Voltar ao topo (hover)" },
    active: { fg: c.heading, bg: c.primaryPressedSurface, kind: "nonText", where: "Voltar ao topo (pressionado)" },
  },
  accordionTrigger: {
    default: { fg: c.text, bg: c.white, kind: "text", where: "Pergunta do acordeão" },
    hover: { fg: c.text, bg: c.primarySurface, kind: "text", where: "Pergunta do acordeão (hover)" },
  },
  modalityChip: {
    default: { fg: c.primary, bg: c.white, kind: "text", where: "Filtro de modalidade" },
    checked: { fg: c.white, bg: c.primary, kind: "text", where: "Filtro de modalidade (marcado)" },
  },
  menuToggle: {
    default: { fg: c.white, bg: c.primary, kind: "nonText", where: "Botão do menu mobile" },
    hover: { fg: c.white, bg: c.primaryHover, kind: "nonText", where: "Botão do menu mobile (hover)" },
    expanded: { fg: c.white, bg: c.primaryActive, kind: "nonText", where: "Botão do menu mobile (aberto)" },
  },
  focusRing: {
    onWhite: { fg: c.focus, bg: c.white, kind: "nonText", where: "Anel de foco sobre branco" },
    onSurface: { fg: c.focus, bg: c.primarySurface, kind: "nonText", where: "Anel de foco sobre emerald-10" },
  },
} as const satisfies Record<string, Record<string, ColorPair>>;

/** Lista achatada de todos os pares, para testes e relatórios */
export function allColorPairs(): (ColorPair & { id: string })[] {
  return Object.entries(interactionStates).flatMap(([component, states]) =>
    Object.entries(states).map(([state, pair]) => ({ id: `${component}.${state}`, ...pair })),
  );
}

/** Contraste WCAG 2.1 entre duas cores hexadecimais */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const value = hex.replace("#", "");
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const channel = parseInt(value.slice(i, i + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
