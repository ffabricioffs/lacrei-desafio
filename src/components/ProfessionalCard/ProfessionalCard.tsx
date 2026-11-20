"use client";

import { useId, useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/Button/Button";
import type { Modality, Professional } from "@/types/professional";

const MODALITY_LABEL: Record<Modality, string> = {
  online: "Online",
  presencial: "Presencial",
};

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  height: 100%;
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderCard};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md};
`;

const Avatar = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Name = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Meta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Specialty = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Badges = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
`;

const Badge = styled.li<{ $tone?: "primary" | "neutral" }>`
  padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ $tone, theme }) =>
    $tone === "primary" ? theme.colors.primarySurface : theme.colors.surface};
  color: ${({ theme }) => theme.colors.heading};
  border: 1px solid
    ${({ $tone, theme }) => ($tone === "primary" ? theme.colors.primaryLight : theme.colors.border)};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  padding-top: ${({ theme }) => theme.space.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
  }

  ul {
    padding-left: ${({ theme }) => theme.space.lg};
  }
`;

const Actions = styled.div`
  margin-top: auto;
`;

function initials(name: string) {
  return name
    .replace(/^(Dra?\.|Dre\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const titleId = useId();

  return (
    <Card aria-labelledby={titleId}>
      <Top>
        <Avatar aria-hidden="true">{initials(professional.name)}</Avatar>
        <div>
          <Name id={titleId}>{professional.name}</Name>
          <Meta>
            Pronomes: {professional.pronouns} · {professional.registry}
          </Meta>
        </div>
      </Top>

      <div>
        <Specialty>{professional.specialty}</Specialty>
        <Meta>
          {professional.city} – {professional.state}
        </Meta>
      </div>

      <Badges role="list" aria-label="Modalidades e áreas de atuação">
        {professional.modalities.map((modality) => (
          <Badge key={modality} $tone="primary">
            {MODALITY_LABEL[modality]}
          </Badge>
        ))}
        {professional.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </Badges>

      <Details id={detailsId} hidden={!expanded}>
        <p>{professional.bio}</p>
        <h4>Acessibilidade no atendimento</h4>
        <ul>
          {professional.accessibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Details>

      <Actions>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
          <span className="visually-hidden">{`\u00A0de ${professional.name}`}</span>
        </Button>
      </Actions>
    </Card>
  );
}
