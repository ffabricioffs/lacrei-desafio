"use client";

import Link from "next/link";
import styled from "styled-components";
import { Container, Lead } from "@/components/ui/Layout";
import { media } from "@/styles/theme";

const Wrapper = styled.div`
  padding-block: ${({ theme }) => theme.space.xl};

  ${media.md} {
    padding-block: ${({ theme }) => theme.space.xxl} ${({ theme }) => theme.space.xl};
  }
`;

const Breadcrumb = styled.nav`
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  ol {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space.xs};
  }

  li + li::before {
    content: "/";
    margin-right: ${({ theme }) => theme.space.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  [aria-current="page"] {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.sm};

  ${media.md} {
    font-size: 2.5rem;
  }
`;

const Disclaimer = styled.p`
  margin-top: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function ProfessionalsIntro() {
  return (
    <Wrapper>
      <Container>
        <Breadcrumb aria-label="Você está em">
          <ol role="list">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <span aria-current="page">Buscar profissionais</span>
            </li>
          </ol>
        </Breadcrumb>
        <Title>Encontre profissionais de saúde</Title>
        <Lead>
          Busque por nome, especialidade, cidade ou tema de cuidado e filtre pela modalidade de
          atendimento que funciona melhor para você.
        </Lead>
        <Disclaimer>
          Os perfis abaixo são fictícios e servem apenas para demonstrar a integração com a API
          simulada.
        </Disclaimer>
      </Container>
    </Wrapper>
  );
}

export const SearchContainer = styled(Container)`
  padding-bottom: ${({ theme }) => theme.space.xxxl};
`;
