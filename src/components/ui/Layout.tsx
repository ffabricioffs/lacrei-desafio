"use client";

import styled from "styled-components";
import { media } from "@/styles/theme";

/**
 * Container do grid Marsha: 24px de margem no mobile e conteúdo de até
 * 1116px no desktop (artboard de 1440px com 162px de margem lateral).
 */
export const Container = styled.div`
  width: 100%;
  max-width: calc(${({ theme }) => theme.layout.maxWidth} + 2 * ${({ theme }) => theme.space.md});
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.space.md};

  ${media.md} {
    max-width: calc(${({ theme }) => theme.layout.maxWidth} + 2 * ${({ theme }) => theme.space.xl});
    padding-inline: ${({ theme }) => theme.space.xl};
  }
`;

/** Esconde visualmente, mas mantém o conteúdo disponível para leitores de tela */
export const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Section = styled.section`
  padding-block: ${({ theme }) => theme.space.xl};

  ${media.lg} {
    padding-block: ${({ theme }) => theme.space.xxxl};
  }
`;

/** Headline-lg (Seções): 24px no mobile → 40px no desktop, Bold, 120% */
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space.sm};

  ${media.lg} {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }
`;

/** Texto de apoio: Text-base (16px) no mobile → Text-xl (18px) no desktop */
export const Lead = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  max-width: 62ch;

  ${media.lg} {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;
