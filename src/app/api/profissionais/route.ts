import type { NextRequest } from "next/server";
import data from "@/data/profissionais.json";
import { filterProfessionals, listSpecialties } from "@/lib/professionals";
import type { Modality, Professional, ProfessionalsResponse } from "@/types/professional";

/**
 * API simulada (mock) de profissionais.
 * GET /api/profissionais?q=&especialidade=&modalidade=
 *
 * Lê um JSON local para imitar o contrato que o Back-end entregaria.
 * Trocar por uma API real exige mudar apenas `src/services/professionals.ts`.
 */
const professionals = data as Professional[];
const MODALITIES: Modality[] = ["online", "presencial"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const modalityParam = params.get("modalidade") ?? "";
  const modality = MODALITIES.includes(modalityParam as Modality) ? (modalityParam as Modality) : "";

  const result = filterProfessionals(professionals, {
    q: (params.get("q") ?? "").slice(0, 100),
    specialty: params.get("especialidade") ?? "",
    modality,
  });

  const body: ProfessionalsResponse = {
    data: result,
    total: result.length,
    specialties: listSpecialties(professionals),
  };

  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
