"use client";

import styled from "styled-components";

/**
 * Link "Pular para o conteúdo" — primeiro item focável da página (WCAG 2.4.1).
 * Fica fora da tela até receber foco pelo teclado e, então, aparece com o
 * visual do botão primário do Marsha e o anel de foco oficial.
 */
const StyledSkipLink = styled.a`
  position: absolute;
  top: ${({ theme }) => theme.space.sm};
  left: ${({ theme }) => theme.space.sm};
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 12px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transform: translateY(-200%);
  transition: transform 0.15s ease-in-out;

  &:focus {
    transform: translateY(0);
  }
`;

export function SkipLink({ targetId = "conteudo" }: { targetId?: string }) {
  return <StyledSkipLink href={`#${targetId}`}>Pular para o conteúdo principal</StyledSkipLink>;
}
