"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    scroll-padding-top: ${({ theme }) => theme.layout.headerHeight};
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.white};
    -webkit-font-smoothing: antialiased;
  }

  main {
    flex: 1;
  }

  img, svg, picture {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3, h4 {
    line-height: ${({ theme }) => theme.lineHeights.tight};
    overflow-wrap: break-word;
  }

  p {
    overflow-wrap: break-word;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-underline-offset: 0.2em;
  }

  ul[role="list"], ol[role="list"] {
    list-style: none;
    padding: 0;
  }

  /* Garante que [hidden] vença qualquer display definido nos componentes */
  [hidden] {
    display: none !important;
  }

  /*
   * Texto só para leitores de tela. Por ser position: absolute, o navegador
   * descarta o espaço inicial ao calcular o nome acessível ("Ver detalhesde"):
   * por isso o conteúdo começa com espaço não separável ( ).
   * Encontrado no teste manual com NVDA + Edge.
   */
  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Foco sempre visível para quem navega por teclado (WCAG 2.4.7) */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
