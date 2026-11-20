"use client";

import styled from "styled-components";

/**
 * Link "Pular para o conteúdo" — primeiro item focável da página.
 * Fica fora da tela até receber foco pelo teclado (WCAG 2.4.1).
 */
const StyledSkipLink = styled.a`
  position: absolute;
  top: ${({ theme }) => theme.space.xs};
  left: ${({ theme }) => theme.space.xs};
  z-index: 1000;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.radii.md};
  transform: translateY(-200%);
  transition: transform 0.15s ease-in-out;

  &:focus {
    transform: translateY(0);
  }
`;

export function SkipLink({ targetId = "conteudo" }: { targetId?: string }) {
  return <StyledSkipLink href={`#${targetId}`}>Pular para o conteúdo principal</StyledSkipLink>;
}
