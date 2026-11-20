"use client";

import Image from "next/image";
import styled from "styled-components";
import { ButtonLink } from "@/components/Button/Button";
import { Accordion, type AccordionItem } from "@/components/Accordion/Accordion";
import { Container, Lead, Section, SectionTitle } from "@/components/ui/Layout";
import { media } from "@/styles/theme";

/* ---------- Hero ---------- */

const HeroSection = styled.section`
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.white} 0%, #f4fbf8 100%);
  padding-block: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.xxl};

  ${media.md} {
    padding-block: ${({ theme }) => theme.space.xxxl};
  }
`;

const HeroGrid = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space.xl};
  align-items: center;

  ${media.lg} {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.md};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.display};
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.xl};

  ${media.sm} {
    flex-direction: row;
  }
`;

const HeroImage = styled.div`
  max-width: 420px;
  width: 100%;
  margin-inline: auto;

  img {
    width: 100%;
    height: auto;
  }
`;

export function Hero() {
  return (
    <HeroSection aria-labelledby="hero-titulo">
      <HeroGrid>
        <div>
          <HeroTitle id="hero-titulo">Cuidado em saúde com respeito e segurança</HeroTitle>
          <Lead>
            Encontre profissionais de saúde comprometidos com o atendimento inclusivo da
            comunidade <strong>LGBTQIAPN+</strong>. Seu nome, seus pronomes e sua história são
            respeitados do início ao fim.
          </Lead>
          <HeroActions>
            <ButtonLink href="/profissionais">Buscar atendimento</ButtonLink>
            <ButtonLink href="#como-funciona" variant="secondary">
              Entenda como funciona
            </ButtonLink>
          </HeroActions>
        </div>
        <HeroImage>
          {/* Imagem acima da dobra: carregada com prioridade (melhora o LCP) */}
          <Image
            src="/images/hero-cuidado.svg"
            alt=""
            width={480}
            height={400}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 420px, 90vw"
          />
        </HeroImage>
      </HeroGrid>
    </HeroSection>
  );
}

/* ---------- Como funciona ---------- */

const StepsGrid = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space.xl};
  align-items: center;

  ${media.lg} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Steps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  margin-top: ${({ theme }) => theme.space.xl};
  counter-reset: steps;
`;

const Step = styled.li`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: ${({ theme }) => theme.space.md};
  counter-increment: steps;

  &::before {
    content: counter(steps);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeights.extrabold};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.space.xxs};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StepsImage = styled.div`
  max-width: 480px;
  width: 100%;
  margin-inline: auto;

  img {
    width: 100%;
    height: auto;
  }
`;

const STEPS = [
  {
    title: "Busque com filtros que importam",
    text: "Filtre por especialidade, cidade e modalidade, online ou presencial.",
  },
  {
    title: "Conheça quem vai te atender",
    text: "Veja pronomes, áreas de atuação e recursos de acessibilidade de cada profissional.",
  },
  {
    title: "Escolha com tranquilidade",
    text: "Cada perfil mostra o registro profissional e o compromisso com o cuidado inclusivo.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona" aria-labelledby="como-funciona-titulo">
      <StepsGrid>
        <div>
          <SectionTitle id="como-funciona-titulo">Como funciona</SectionTitle>
          <Lead>Em três passos você encontra um atendimento acolhedor.</Lead>
          <Steps>
            {STEPS.map((step) => (
              <Step key={step.title}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </Step>
            ))}
          </Steps>
        </div>
        <StepsImage>
          {/* Abaixo da dobra: lazy load padrão do next/image */}
          <Image
            src="/images/como-funciona.svg"
            alt="Ilustração de uma busca com um card de profissional e um sinal de confirmação"
            width={480}
            height={360}
            loading="lazy"
            sizes="(min-width: 1024px) 480px, 90vw"
          />
        </StepsImage>
      </StepsGrid>
    </Section>
  );
}

/* ---------- Para quem é ---------- */

const AudienceSection = styled(Section)`
  background: ${({ theme }) => theme.colors.lavender};
`;

const Cards = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
  margin-top: ${({ theme }) => theme.space.xl};

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    flex: 1;
  }
`;

export function Audience() {
  return (
    <AudienceSection aria-labelledby="publico-titulo">
      <Container>
        <SectionTitle id="publico-titulo">Para quem é a Lacrei Saúde</SectionTitle>
        <Cards role="list">
          <Card>
            <h3>Pacientes</h3>
            <p>
              Pessoas LGBTQIAPN+ que buscam atendimento em saúde sem julgamentos, com segurança e
              privacidade dos seus dados.
            </p>
            <ButtonLink href="/profissionais" variant="primary">
              Encontrar profissionais
            </ButtonLink>
          </Card>
          <Card>
            <h3>Profissionais da saúde</h3>
            <p>
              Profissionais que querem oferecer um cuidado inclusivo e alcançar quem mais precisa
              desse acolhimento.
            </p>
            <ButtonLink href="https://profissional.lacreisaude.com.br/" variant="secondary" external>
              Oferecer atendimento
            </ButtonLink>
          </Card>
        </Cards>
      </Container>
    </AudienceSection>
  );
}

/* ---------- Perguntas frequentes ---------- */

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: "nome-social",
    title: "Meu nome social será respeitado?",
    content: (
      <p>
        Sim. O nome social e os pronomes informados são usados em toda a comunicação e nos
        atendimentos, conforme o compromisso assumido por cada profissional.
      </p>
    ),
  },
  {
    id: "dados",
    title: "Meus dados ficam protegidos?",
    content: (
      <p>
        A Lacrei Saúde segue a LGPD. Seus dados só são usados para viabilizar o atendimento e você
        pode solicitar acesso, correção ou exclusão a qualquer momento.
      </p>
    ),
  },
  {
    id: "emergencia",
    title: "Posso usar a Lacrei Saúde em uma emergência?",
    content: (
      <p>
        Não. A plataforma não oferece atendimento de emergência. Nesses casos, procure o hospital
        mais próximo ou ligue para o SAMU (192).
      </p>
    ),
  },
];

const FaqContainer = styled(Container)`
  max-width: 880px;
`;

export function Faq() {
  return (
    <Section aria-labelledby="faq-titulo">
      <FaqContainer>
        <SectionTitle id="faq-titulo">Perguntas frequentes</SectionTitle>
        <Accordion items={FAQ_ITEMS} headingLevel={3} />
      </FaqContainer>
    </Section>
  );
}
