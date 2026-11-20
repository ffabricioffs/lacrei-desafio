import type { Professional, ProfessionalFilters } from "@/types/professional";

/** Remove acentos e caixa para buscas tolerantes ("saude" encontra "Saúde") */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function filterProfessionals(
  list: Professional[],
  { q = "", specialty = "", modality = "" }: ProfessionalFilters,
): Professional[] {
  const term = normalize(q);
  const specialtyTerm = normalize(specialty);

  return list.filter((professional) => {
    const matchesTerm =
      !term ||
      [
        professional.name,
        professional.specialty,
        professional.city,
        professional.state,
        ...professional.tags,
      ].some((field) => normalize(field).includes(term));

    const matchesSpecialty = !specialtyTerm || normalize(professional.specialty) === specialtyTerm;
    const matchesModality = !modality || professional.modalities.includes(modality);

    return matchesTerm && matchesSpecialty && matchesModality;
  });
}

export function listSpecialties(list: Professional[]): string[] {
  return [...new Set(list.map((p) => p.specialty))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
