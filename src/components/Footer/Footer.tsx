"use client";

import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/ui/Layout";
import { media } from "@/styles/theme";

const LACREI_URL = "https://lacreisaude.com.br";

type FooterLink = { label: string; href: string; external?: boolean };

export const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Lacrei Saúde",
    links: [
      { label: "Quem somos", href: `${LACREI_URL}/quem-somos/`, external: true },
      { label: "Nosso propósito", href: `${LACREI_URL}/quem-somos/#proposito`, external: true },
      { label: "Acessibilidade", href: `${LACREI_URL}/acessibilidade/`, external: true },
    ],
  },
  {
    title: "Saúde",
    links: [
      { label: "Buscar atendimento", href: "/profissionais" },
      { label: "Como funciona", href: "/#como-funciona" },
      {
        label: "Oferecer atendimento",
        href: "https://profissional.lacreisaude.com.br/",
        external: true,
      },
    ],
  },
  {
    title: "Segurança e privacidade",
    links: [
      {
        label: "Política de privacidade",
        href: `${LACREI_URL}/politica-de-privacidade/`,
        external: true,
      },
      { label: "Termos de uso", href: `${LACREI_URL}/termos-de-uso/`, external: true },
      { label: "Direitos de titular", href: `${LACREI_URL}/direitos-de-titular/`, external: true },
    ],
  },
];

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.primarySurface};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  padding-block: ${({ theme }) => theme.space.xxl} ${({ theme }) => theme.space.xl};
  margin-top: auto;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.xl};
  grid-template-columns: 1fr;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: 1.4fr repeat(3, 1fr);
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const BrandName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ColumnTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
`;

const linkStyles = `
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  font-size: 1rem;
  text-decoration: underline;
`;

const InternalLink = styled(Link)`
  ${linkStyles}
  color: ${({ theme }) => theme.colors.text};
  &:hover { color: ${({ theme }) => theme.colors.primaryActive}; }
`;

const ExternalLink = styled.a`
  ${linkStyles}
  color: ${({ theme }) => theme.colors.text};
  &:hover { color: ${({ theme }) => theme.colors.primaryActive}; }
`;

const Notice = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
  padding-top: ${({ theme }) => theme.space.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const NoticeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

export function Footer() {
  return (
    <Wrapper>
      <Container>
        <Grid>
          <Brand>
            <BrandName>Lacrei Saúde</BrandName>
            <Muted>
              Conectando a comunidade LGBTQIAPN+ a profissionais de saúde com cuidado,
              acolhimento e segurança.
            </Muted>
          </Brand>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-labelledby={`footer-${slug(section.title)}`}>
              <ColumnTitle id={`footer-${slug(section.title)}`}>{section.title}</ColumnTitle>
              <LinkList role="list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <ExternalLink href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <span className="visually-hidden"> (abre em nova aba)</span>
                      </ExternalLink>
                    ) : (
                      <InternalLink href={link.href}>{link.label}</InternalLink>
                    )}
                  </li>
                ))}
              </LinkList>
            </nav>
          ))}
        </Grid>

        <Notice>
          <NoticeText>
            <strong>A Lacrei Saúde não oferece atendimento de emergência.</strong> Em caso de
            emergência, procure o hospital mais próximo ou ligue para o SAMU (192).
          </NoticeText>
          <NoticeText>
            Precisa de apoio emocional? Ligue gratuitamente para o CVV no <strong>188</strong> ou
            acesse{" "}
            <ExternalLink href="https://cvv.org.br/" target="_blank" rel="noopener noreferrer">
              cvv.org.br
              <span className="visually-hidden"> (abre em nova aba)</span>
            </ExternalLink>
            .
          </NoticeText>
          <Muted>© 2026 Lacrei Saúde. Projeto desenvolvido para o desafio técnico de Front-end.</Muted>
        </Notice>
      </Container>
    </Wrapper>
  );
}

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}
