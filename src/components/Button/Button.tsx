"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

interface StyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

/**
 * Estilos do botão Marsha: raio 8px, Nunito 700, verde primário.
 * - primary: fundo verde, texto branco
 * - secondary: contorno verde, fundo branco
 * - ghost: só texto verde (ações de menor ênfase)
 * Altura mínima de 48px para alvo de toque confortável (WCAG 2.5.8).
 */
const buttonStyles = css<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  min-height: ${({ $size }) => ($size === "sm" ? "40px" : "48px")};
  padding: ${({ $size, theme }) =>
    $size === "sm" ? `${theme.space.xs} ${theme.space.md}` : `10px ${theme.space.xl}`};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ $size, theme }) => ($size === "sm" ? theme.fontSizes.md : theme.fontSizes.lg)};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background: ${theme.colors.white};
          color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primarySurface};
            color: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          border-color: transparent;
          color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            color: ${theme.colors.primaryHover};
            text-decoration: underline;
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.primaryActive};
            border-color: ${theme.colors.primaryActive};
          }
        `;
    }
  }}

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.border};
    border-color: ${({ theme }) => theme.colors.border};
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
