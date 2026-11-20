/**
 * Tokens do Marsha Design System (Guia de Estilo – Marsha P. Johnson, Figma).
 * Fonte: páginas "Cores", "Tipografia", "Espaços", "Pontos de quebra",
 * "Button", "Header" e "Footer" do guia oficial da Lacrei Saúde.
 * Os nomes entre parênteses são os tokens do Figma.
 *
 * Contraste (WCAG 2.1) sobre branco:
 * - primary / emerald-60 (#018762): 4,52:1 → AA texto normal
 * - heading / gray-80 (#131313): 18,6:1 → AAA
 * - body / gray-70 (#2D2D2D): 13,8:1 → AAA
 * - textSecondary / gray-60 (#515151): 7,9:1 → AAA
 * - focus / blue-60 (#28588A): 7,4:1 → anel de foco bem visível
 */
export const theme = {
  colors: {
    // Marca (Colors/Brand/Emerald)
    primary: "#018762", // emerald-60 · Background/accent
    primaryHover: "#007756", // emerald-70 · color-background-accent-hover
    primaryActive: "#014C37", // emerald-80 · color-background-accent-pressed
    primaryBorderHover: "#29A480", // emerald-50 · color-border-hover
    primaryPressedSurface: "#80CAB1", // emerald-30 · color-background-success-pressed
    primaryLight: "#B2DFD0", // emerald-20 · color-background-success-hover / divisórias
    primarySurface: "#DFF2ED", // emerald-10
    gradientSubtle: "linear-gradient(180deg, #F5FFFB 31%, #FFFFFF 100%)", // gradient-subtle
    // Sistema (Colors/System)
    heading: "#131313", // gray-80 · Text/heading
    text: "#2D2D2D", // gray-70 · Text/body
    textSecondary: "#515151", // gray-60 · color-text-disabled
    borderCard: "#BFBFBF", // gray-40 · Border/card
    border: "#CFCFCF", // gray-30 · color-border-tertiary / disabled
    surface: "#F0F0F0", // gray-20
    white: "#FFFFFF", // gray-10
    error: "#BC1C1C", // red-60
    errorSurface: "#FCE9E9", // red-20
    info: "#28588A", // blue-60
    infoSurface: "#EBF2F9", // blue-10
    focus: "#28588A", // color-border-focus-info
  },
  fonts: {
    body: "var(--font-nunito), 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  /** Escala tipográfica "Padrões de fontes" do guia */
  fontSizes: {
    xs: "0.75rem", // 12px · Text-xs
    sm: "0.875rem", // 14px · Text-sm
    md: "1rem", // 16px · Text-base
    lg: "1.125rem", // 18px · Text-xl
    xl: "1.5rem", // 24px · Headline-sm
    xxl: "2rem", // 32px · Headline-base
    xxxl: "2.5rem", // 40px · Headline-lg
    display: "3rem", // 48px · Headline-xl
  },
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2, // Headline
    normal: 1.5, // Text
  },
  /** Sistema de espaçamento em múltiplos de 8px (página "Espaços") */
  space: {
    xxs: "0.25rem", // 4
    xs: "0.5rem", // 8
    sm: "1rem", // 16
    md: "1.5rem", // 24
    lg: "2rem", // 32
    xl: "3rem", // 48
    xxl: "4rem", // 64
    xxxl: "5rem", // 80
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    pill: "999px",
  },
  shadows: {
    button: "0 5px 5px rgba(0, 0, 0, 0.3)", // drop-shadow dos botões
    md: "0 5px 10px rgba(0, 0, 0, 0.3)", // Shadow/shadow-md
    soft: "0 2px 8px rgba(19, 19, 19, 0.08)",
  },
  /**
   * Pontos de quebra do guia: mobile < 600px · tablet 600–1023px ·
   * desktop ≥ 1024px · grid "XL" a partir de 1200px. Mobile-first.
   */
  breakpoints: {
    sm: "480px",
    md: "600px",
    lg: "1024px",
    xl: "1200px",
  },
  layout: {
    /** Conteúdo de 1116px (1440px de artboard − 2 × 162px de margem) */
    maxWidth: "1116px",
    headerHeight: "96px",
  },
} as const;

export type AppTheme = typeof theme;

export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
