import type { ProfessionalFilters, ProfessionalsResponse } from "@/types/professional";

export const PROFESSIONALS_ENDPOINT = "/api/profissionais";

/** Cliente da API de profissionais. Único ponto que conhece a URL e o formato da resposta. */
export async function fetchProfessionals(
  filters: ProfessionalFilters,
  signal?: AbortSignal,
): Promise<ProfessionalsResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.specialty) params.set("especialidade", filters.specialty);
  if (filters.modality) params.set("modalidade", filters.modality);

  const query = params.toString();
  const response = await fetch(`${PROFESSIONALS_ENDPOINT}${query ? `?${query}` : ""}`, { signal });

  if (!response.ok) {
    throw new Error(`Falha ao buscar profissionais (HTTP ${response.status})`);
  }

  return response.json();
}
