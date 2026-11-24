"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";
import { interactionStates as states } from "@/styles/interactionStates";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

interface StyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

/**
 * Botão "ButtonDefault" do Marsha Design System (handoff do Figma):
 * altura 48px, padding 12px 32px, raio 8px, Nunito Bold 18px/27px.
 * - primary (Solid): emerald-60; hover emerald-70; pressionado emerald-80
 * - secondary (Outline): borda 2px emerald-60; hover fundo emerald-20,
 *   borda emerald-50 e texto emerald-80; pressionado fundo emerald-30 e borda emerald-80
 * - ghost (Button Link): só texto; hover fundo emerald-20 e texto emerald-80
 *   (o Figma usa texto emerald-70 no hover, 3,81:1; ver styles/interactionStates.ts)
 * - foco: anel 2px blue-60 afastado 4px do botão (color-border-focus-info)
 * - desabilitado: fundo gray-30 e texto gray-60
 */
const buttonStyles = css<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  /* 48px como no handoff: a altura vem do min-height, não do padding vertical
     (12px + 27px + 12px + borda passaria de 48). Texto longo ainda cresce. */
  min-height: 48px;
  padding: ${({ $size }) => ($size === "sm" ? "0 24px" : "0 32px")};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ $size, theme }) => ($size === "sm" ? theme.fontSizes.md : theme.fontSizes.lg)};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii.md};
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background: ${states.buttonSecondary.default.bg};
          border-color: ${theme.colors.primary};
          color: ${states.buttonSecondary.default.fg};
          box-shadow: ${theme.shadows.button};

          &:hover:not(:disabled) {
            background: ${states.buttonSecondary.hover.bg};
            border-color: ${theme.colors.primaryBorderHover};
            color: ${states.buttonSecondary.hover.fg};
          }

          &:active:not(:disabled) {
            background: ${states.buttonSecondary.active.bg};
            border-color: ${theme.colors.primaryActive};
            color: ${states.buttonSecondary.active.fg};
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: ${states.buttonGhost.default.fg};

          &:hover:not(:disabled) {
            background: ${states.buttonGhost.hover.bg};
            color: ${states.buttonGhost.hover.fg};
          }

          &:active:not(:disabled) {
            background: ${states.buttonGhost.active.bg};
            color: ${states.buttonGhost.active.fg};
          }
        `;
      default:
        return css`
          background: ${states.buttonPrimary.default.bg};
          border-color: ${states.buttonPrimary.default.bg};
          color: ${states.buttonPrimary.default.fg};
          box-shadow: ${theme.shadows.button};

          &:hover:not(:disabled) {
            background: ${states.buttonPrimary.hover.bg};
            border-color: ${states.buttonPrimary.hover.bg};
            color: ${states.buttonPrimary.hover.fg};
          }

          &:active:not(:disabled) {
            background: ${states.buttonPrimary.active.bg};
            border-color: ${states.buttonPrimary.active.bg};
            color: ${states.buttonPrimary.active.fg};
          }
        `;
    }
  }}

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    background: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.border : theme.colors.white};
    border-color: ${({ $variant, theme }) =>
      $variant === "ghost" ? "transparent" : theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: none;
  }
`;

const StyledButton = styled.button<StyleProps>`
  ${buttonStyles}
`;

const StyledLink = styled(Link)<StyleProps>`
  ${buttonStyles}
`;

const StyledAnchor = styled.a<StyleProps>`
  ${buttonStyles}
`;

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

export type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    /** Abre em nova aba e avisa o leitor de tela */
    external?: boolean;
  };

/**
 * Link com aparência de botão. Usa next/link para rotas internas
 * (prefetch + navegação client-side) e <a> comum para links externos.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  external = false,
  children,
  ...rest
}: ButtonLinkProps) {
  const styleProps = { $variant: variant, $size: size, $fullWidth: fullWidth };

  if (external) {
    return (
      <StyledAnchor href={href} target="_blank" rel="noopener noreferrer" {...styleProps} {...rest}>
        {children}
        <span className="visually-hidden">{"\u00A0(abre em nova aba)"}</span>
      </StyledAnchor>
    );
  }

  const isHashLink = href.startsWith("#");
  if (isHashLink) {
    return (
      <StyledAnchor href={href} {...styleProps} {...rest}>
        {children}
      </StyledAnchor>
    );
  }

  return (
    <StyledLink href={href} {...styleProps} {...rest}>
      {children}
    </StyledLink>
  );
}
