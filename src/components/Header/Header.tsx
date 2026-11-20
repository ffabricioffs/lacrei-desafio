"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/Button/Button";
import { media } from "@/styles/theme";

export const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/profissionais", label: "Buscar profissionais" },
  { href: "/#como-funciona", label: "Como funciona" },
] as const;

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: ${({ theme }) => theme.layout.headerHeight};
  gap: ${({ theme }) => theme.space.md};
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  letter-spacing: -0.01em;
`;

const MenuToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};

  &[aria-expanded="true"] {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  ${media.md} {
    display: none;
  }
`;

const Nav = styled.nav<{ $open: boolean }>`
  /* Mobile: painel abaixo do header, exibido só quando aberto */
  display: ${({ $open }) => ($open ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.md};

  ${media.md} {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space.lg};
    position: static;
    padding: 0;
    border: 0;
    box-shadow: none;
    background: transparent;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
  margin-bottom: ${({ theme }) => theme.space.md};

  ${media.md} {
    flex-direction: row;
    gap: ${({ theme }) => theme.space.lg};
    margin-bottom: 0;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding-inline: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  &[aria-current="page"] {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-decoration-thickness: 3px;
  }
`;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Fecha o menu ao trocar de rota (padrão "ajustar estado durante o render",
  // recomendado pelo React em vez de setState dentro de useEffect)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Esc fecha o menu e devolve o foco ao botão que o abriu
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <Bar>
      <Inner>
        <Logo href="/" aria-label="Lacrei Saúde, ir para a página inicial">
          Lacrei Saúde
        </Logo>

        <MenuToggle
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </MenuToggle>

        <Nav id={menuId} aria-label="Navegação principal" $open={open}>
          <NavList role="list">
            {NAV_ITEMS.map((item) => {
              const isActive = !item.href.includes("#") && pathname === item.href;
              return (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </NavList>
          <ButtonLink href="/profissionais" size="sm">
            Buscar atendimento
          </ButtonLink>
        </Nav>
      </Inner>
    </Bar>
  );
}
