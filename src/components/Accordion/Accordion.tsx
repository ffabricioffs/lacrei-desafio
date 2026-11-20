"use client";

import { useId, useState, type ReactNode } from "react";
import styled from "styled-components";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Nível do cabeçalho de cada item, para manter a hierarquia da página */
  headingLevel?: 2 | 3 | 4;
  defaultOpenId?: string;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderCard};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const Heading = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
  min-height: 56px;
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
  background: none;
  border: 0;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.heading};

  &:hover {
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  &:focus-visible {
    outline-offset: -3px;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    transition: transform 0.2s ease;
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;

const Panel = styled.div`
  padding: ${({ theme }) => `0 ${theme.space.lg} ${theme.space.lg}`};
  color: ${({ theme }) => theme.colors.text};
`;

function Chevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Acordeão acessível seguindo o padrão WAI-ARIA Authoring Practices:
 * cabeçalho > botão com aria-expanded/aria-controls e painel com
 * role="region" rotulado pelo botão. Vários itens podem ficar abertos.
 */
export function Accordion({ items, headingLevel = 3, defaultOpenId }: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpenId ? [defaultOpenId] : []),
  );

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <List>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <Item key={item.id}>
            <Heading as={`h${headingLevel}`}>
              <Trigger
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <Chevron />
              </Trigger>
            </Heading>
            <Panel id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen}>
              {item.content}
            </Panel>
          </Item>
        );
      })}
    </List>
  );
}
