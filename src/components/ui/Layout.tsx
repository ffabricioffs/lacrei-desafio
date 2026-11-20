"use client";

import styled from "styled-components";
import { media } from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.space.md};

  ${media.md} {
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
  padding-block: ${({ theme }) => theme.space.xxl};

  ${media.md} {
    padding-block: ${({ theme }) => theme.space.xxxl};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.md};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

export const Lead = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 62ch;

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;
