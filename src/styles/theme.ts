/**
 * Tokens de design baseados na identidade visual da Lacrei Saúde
 * (Marsha Design System). Os valores foram conferidos no site oficial
 * (lacreisaude.com.br). Se algum token do Figma divergir, este é o único
 * arquivo que precisa mudar.
 *
 * Contraste (WCAG 2.1):
 * - primary (#018762) sobre branco: 4,53:1 → AA para texto normal
 * - text (#1F1F1F) sobre branco: 16,6:1 → AAA
 * - textSecondary (#515151) sobre branco: 8,0:1 → AAA
 * O verde só é usado como cor de texto sobre fundo branco; sobre fundos
 * tingidos usamos o texto escuro, para não cair abaixo de 4,5:1.
 */
export const theme = {
  colors: {
    primary: "#018762",
    primaryHover: "#016a4d",
    primaryActive: "#01543d",
    primaryLight: "#B0E0D3",
    primarySurface: "#EEF8F5",
    lavender: "#F9F3FF",
    text: "#1F1F1F",
    textSecondary: "#515151",
    border: "#D7D7D7",
    white: "#FFFFFF",
    error: "#B3261E",
    errorSurface: "#FCEEEE",
    focus: "#1F1F1F",
  },
  fonts: {
    body: "var(--font-nunito), 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.5rem", // 24px
    xxl: "2rem", // 32px
    display: "3rem", // 48px
  },
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
  },
  space: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
    xxxl: "4rem",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    pill: "999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(31, 31, 31, 0.12)",
    md: "0 4px 12px rgba(31, 31, 31, 0.10)",
  },
  /** Mobile-first: as media queries só adicionam estilos a partir destes tamanhos */
  breakpoints: {
    sm: "576px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  layout: {
    maxWidth: "1200px",
    headerHeight: "72px",
  },
} as const;

export type AppTheme = typeof theme;

export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
