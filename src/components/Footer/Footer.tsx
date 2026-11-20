"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { Container } from "@/components/ui/Layout";
import { media } from "@/styles/theme";

const LACREI_URL = "https://lacreisaude.com.br";
const NEW_TAB_HINT = " (abre em nova aba)";

type FooterLink = { label: string; href: string; external?: boolean };

/** Colunas e textos do "Footer Institucional" do Marsha */
export const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Lacrei Saúde",
    links: [
      { label: "Quem Somos", href: `${LACREI_URL}/quem-somos/`, external: true },
      { label: "Nosso Propósito", href: `${LACREI_URL}/quem-somos/#proposito`, external: true },
      {
        label: "Missão, Visão e Valor",
        href: `${LACREI_URL}/quem-somos/#missao-visao-valores`,
        external: true,
      },
      { label: "Acessibilidade", href: `${LACREI_URL}/acessibilidade/`, external: true },
    ],
  },
  {
    title: "Saúde",
    links: [
      { label: "Buscar atendimento", href: "/profissionais" },
      {
        label: "Oferecer atendimento",
        href: "https://profissional.lacreisaude.com.br/",
        external: true,
      },
    ],
  },
  {
    title: "Segurança e Privacidade",
    links: [
      {
        label: "Política de Privacidade",
        href: `${LACREI_URL}/politica-de-privacidade/`,
        external: true,
      },
      { label: "Termos de Uso", href: `${LACREI_URL}/termos-de-uso/`, external: true },
      { label: "Direitos de Titular", href: `${LACREI_URL}/direitos-de-titular/`, external: true },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "Facebook da Lacrei Saúde", href: "https://www.facebook.com/lacrei.saude/", icon: "facebook" },
  { label: "Instagram da Lacrei Saúde", href: "https://www.instagram.com/lacrei.saude", icon: "instagram" },
  { label: "LinkedIn da Lacrei Saúde", href: "https://www.linkedin.com/company/lacrei", icon: "linkedin" },
  { label: "E-mail da Lacrei Saúde", href: "mailto:contato@lacreisaude.com.br", icon: "email" },
] as const;

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.white};
  padding-bottom: ${({ theme }) => theme.space.md};
  margin-top: auto;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
`;

/** Divider do guia: 1px em emerald-20 */
const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.primaryLight};
  margin: 0;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};

  ${media.lg} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

/** Logo + redes sociais (no mobile, as redes vêm depois dos links) */
const Brand = styled.div`
  order: 2;
  display: flex;
  flex-direction: column;
  gap: 56px;

  ${media.lg} {
    order: 1;
  }
`;

const LogoWrap = styled.div`
  display: none;

  ${media.md} {
    display: block;
  }

  img {
    width: auto;
    height: 48px;
  }
`;

const Social = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`;

/** ButtonDefault Ghost/Icon (48 × 48) */
const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:active {
    background: ${({ theme }) => theme.colors.primaryPressedSurface};
  }
`;

const Columns = styled.div`
  order: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};

  /* "Segurança e Privacidade" ocupa a linha toda no mobile, como no guia */
  & > nav:last-child {
    grid-column: 1 / -1;
  }

  ${media.md} {
    grid-template-columns: repeat(3, auto);
    justify-content: space-between;

    & > nav:last-child {
      grid-column: auto;
    }
  }

  ${media.lg} {
    order: 2;
    width: 736px;
  }
`;

/** Text-xl-highlight: 18px Bold em gray-80 */
const ColumnTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

/** "Secondary link": Text-base em gray-70, altura mínima de 48px */
const linkStyles = `
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration: none;
  &:hover { text-decoration: underline; }
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

const Bottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.xl};
`;

/** Text-sm: 14px em gray-70 */
const Notices = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NoticeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

/** ButtonDefault Outline/Icon com borda emerald-50 e sombra */
const BackToTop = styled.a`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid ${({ theme }) => theme.colors.primaryBorderHover};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.button};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:active {
    background: ${({ theme }) => theme.colors.primaryPressedSurface};
    border-color: ${({ theme }) => theme.colors.primaryActive};
  }
`;

function Icon({ name }: { name: string }) {
  return <Image src={`/icons/${name}.svg`} alt="" width={24} height={24} aria-hidden="true" />;
}

export function Footer() {
  return (
    <Wrapper>
      <Container>
        <Stack>
          <Divider />

          <Top>
            <Brand>
              <LogoWrap>
                <Image src="/brand/logo-lacrei-empilhado.svg" alt="Lacrei Saúde" width={169} height={48} />
              </LogoWrap>
              <Social role="list" aria-label="Redes sociais e contato">
                {SOCIAL_LINKS.map((social) => {
                  const isMail = social.href.startsWith("mailto:");
                  return (
                    <li key={social.icon}>
                      <SocialLink
                        href={social.href}
                        {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        <Icon name={social.icon} />
                        <span className="visually-hidden">
                          {social.label}
                          {isMail ? "" : NEW_TAB_HINT}
                        </span>
                      </SocialLink>
                    </li>
                  );
                })}
              </Social>
            </Brand>

            <Columns>
              {FOOTER_SECTIONS.map((section) => (
                <nav key={section.title} aria-labelledby={`footer-${slug(section.title)}`}>
                  <ColumnTitle id={`footer-${slug(section.title)}`}>{section.title}</ColumnTitle>
                  <LinkList role="list">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        {link.external ? (
                          <ExternalLink href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <span className="visually-hidden">{NEW_TAB_HINT}</span>
                          </ExternalLink>
                        ) : (
                          <InternalLink href={link.href}>{link.label}</InternalLink>
                        )}
                      </li>
                    ))}
                  </LinkList>
                </nav>
              ))}
            </Columns>
          </Top>

          <Divider />

          <Bottom>
            <Notices>
              <NoticeGroup>
                <p>
                  A Lacrei Saúde não oferece atendimento de emergência. Em caso de emergência,
                  procure o hospital mais próximo ou ligue para o SAMU (192).
                </p>
                <p>
                  Em caso de auxílio psicológico, ligue para <strong>188</strong> (CVV) ou acesse{" "}
                  <a href="https://cvv.org.br/" target="_blank" rel="noopener noreferrer">
                    cvv.org.br
                    <span className="visually-hidden">{NEW_TAB_HINT}</span>
                  </a>
                  .
                </p>
              </NoticeGroup>
              <p>© 2026 · Projeto desenvolvido para o desafio técnico de Front-end da Lacrei Saúde.</p>
            </Notices>

            <BackToTop href="#topo">
              <Icon name="expand-less" />
              <span className="visually-hidden">Voltar ao topo</span>
            </BackToTop>
          </Bottom>
        </Stack>
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
