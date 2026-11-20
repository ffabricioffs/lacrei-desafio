"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Button } from "@/components/Button/Button";
import { ProfessionalCard } from "@/components/ProfessionalCard/ProfessionalCard";
import { fetchProfessionals } from "@/services/professionals";
import { media } from "@/styles/theme";
import type { Modality, Professional, ProfessionalFilters } from "@/types/professional";

type Status = "loading" | "success" | "error";

const MODALITY_OPTIONS: { value: Modality | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
];

const EMPTY_FILTERS: Required<ProfessionalFilters> = { q: "", specialty: "", modality: "" };

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.primarySurface};
  border-radius: ${({ theme }) => theme.radii.lg};

  ${media.lg} {
    grid-template-columns: 2fr 1fr auto;
    align-items: end;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};

  label {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }
`;

const inputStyles = `
  width: 100%;
  min-height: 48px;
  padding: 0 1rem;
  border-radius: 8px;
  background: #fff;
`;

const Input = styled.input`
  ${inputStyles}
  border: 2px solid ${({ theme }) => theme.colors.textSecondary};
`;

const Select = styled.select`
  ${inputStyles}
  border: 2px solid ${({ theme }) => theme.colors.textSecondary};
`;

const Hint = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  min-width: 0;

  ${media.lg} {
    grid-column: 1 / -1;
  }

  legend {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-bottom: ${({ theme }) => theme.space.xxs};
  }
`;

const Segmented = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
`;

/** Rádio nativo (acessível por padrão) com aparência de "chip" */
const Chip = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space.lg};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  &:has(input:checked) {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  &:has(input:focus-visible) {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};

  ${media.sm} {
    flex-direction: row;
  }

  /* No desktop, alinha o botão aos campos (compensa a linha de dica abaixo deles) */
  ${media.lg} {
    margin-bottom: calc(${({ theme }) => theme.fontSizes.sm} * 1.5 + ${({ theme }) => theme.space.xxs});
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  margin-block: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
`;

const StatusText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Skeleton = styled.li`
  height: 280px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(90deg, #f1f1f1 25%, #e7e7e7 37%, #f1f1f1 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
`;

const Feedback = styled.div<{ $tone: "error" | "neutral" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $tone, theme }) =>
    $tone === "error" ? theme.colors.errorSurface : theme.colors.lavender};
  border-left: 4px solid
    ${({ $tone, theme }) => ($tone === "error" ? theme.colors.error : theme.colors.primary)};
`;

export function ProfessionalSearch() {
  const [draftQuery, setDraftQuery] = useState("");
  const [filters, setFilters] = useState<Required<ProfessionalFilters>>(EMPTY_FILTERS);
  const [status, setStatus] = useState<Status>("loading");
  const [results, setResults] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryId = useId();
  const hintId = useId();
  const specialtyId = useId();
  const modalityName = useId();

  useEffect(() => {
    const controller = new AbortController();

    fetchProfessionals(filters, controller.signal)
      .then((response) => {
        setResults(response.data);
        setSpecialties(response.specialties);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [filters, attempt]);

  /** Aplica filtros e já marca o carregamento (sem setState síncrono dentro do efeito) */
  const applyFilters = (next: Partial<ProfessionalFilters>) => {
    setStatus("loading");
    setFilters((current) => ({ ...current, ...next }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilters({ q: draftQuery.trim() });
  };

  const handleReset = () => {
    setDraftQuery("");
    setStatus("loading");
    setFilters(EMPTY_FILTERS);
    inputRef.current?.focus();
  };

  const retry = () => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  };

  const hasActiveFilters = Boolean(filters.q || filters.specialty || filters.modality);

  const statusMessage =
    status === "loading"
      ? "Carregando profissionais…"
      : status === "error"
        ? "Não foi possível carregar os profissionais."
        : results.length === 1
          ? "1 profissional encontrado"
          : `${results.length} profissionais encontrados`;

  return (
    <div>
      <Form role="search" aria-label="Buscar profissionais" onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor={queryId}>Nome, especialidade, cidade ou tema</label>
          <Input
            ref={inputRef}
            id={queryId}
            type="search"
            name="q"
            autoComplete="off"
            placeholder="Ex.: psicologia, hormonização, Recife"
            aria-describedby={hintId}
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
          />
          <Hint id={hintId}>A busca não diferencia acentos nem maiúsculas.</Hint>
        </Field>

        <Field>
          <label htmlFor={specialtyId}>Especialidade</label>
          <Select
            id={specialtyId}
            name="especialidade"
            value={filters.specialty}
            onChange={(event) => applyFilters({ specialty: event.target.value })}
          >
            <option value="">Todas as especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </Select>
          <Hint>&nbsp;</Hint>
        </Field>

        <FormActions>
          <Button type="submit">Buscar</Button>
        </FormActions>

        <Fieldset>
          <legend>Modalidade de atendimento</legend>
          <Segmented>
            {MODALITY_OPTIONS.map((option) => (
              <Chip key={option.label}>
                <input
                  type="radio"
                  name={modalityName}
                  value={option.value}
                  checked={filters.modality === option.value}
                  onChange={() => applyFilters({ modality: option.value })}
                />
                {option.label}
              </Chip>
            ))}
          </Segmented>
        </Fieldset>
      </Form>

      <section aria-labelledby="resultados-titulo">
        <h2 id="resultados-titulo" className="visually-hidden">
          Resultados da busca
        </h2>

        <ResultsHeader>
          <StatusText role="status" aria-live="polite">
            {statusMessage}
          </StatusText>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Limpar filtros
            </Button>
          )}
        </ResultsHeader>

        {status === "loading" && (
          <Grid aria-hidden="true" data-testid="skeleton">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} />
            ))}
          </Grid>
        )}

        {status === "error" && (
          <Feedback $tone="error" role="alert">
            <p>Tivemos um problema de conexão. Verifique sua internet e tente de novo.</p>
            <Button onClick={retry}>Tentar novamente</Button>
          </Feedback>
        )}

        {status === "success" && results.length === 0 && (
          <Feedback $tone="neutral">
            <p>
              Nenhum profissional corresponde aos filtros escolhidos. Tente outros termos ou
              remova algum filtro.
            </p>
            <Button variant="secondary" onClick={handleReset}>
              Limpar filtros
            </Button>
          </Feedback>
        )}

        {status === "success" && results.length > 0 && (
          <Grid role="list">
            {results.map((professional) => (
              <li key={professional.id}>
                <ProfessionalCard professional={professional} />
              </li>
            ))}
          </Grid>
        )}
      </section>
    </div>
  );
}
