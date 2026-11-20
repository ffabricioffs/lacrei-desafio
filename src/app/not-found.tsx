"use client";

import styled from "styled-components";
import { ButtonLink } from "@/components/Button/Button";
import { Container, Lead } from "@/components/ui/Layout";

const Wrapper = styled(Container)`
  padding-block: ${({ theme }) => theme.space.xxxl};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md};

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function NotFound() {
  return (
    <Wrapper>
      <h1>Página não encontrada</h1>
      <Lead>O endereço pode ter mudado ou não existe mais. Que tal voltar ao início?</Lead>
      <ButtonLink href="/">Voltar para o início</ButtonLink>
    </Wrapper>
  );
}
