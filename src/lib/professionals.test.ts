/**
 * @jest-environment node
 */
import data from "@/data/profissionais.json";
import type { Professional } from "@/types/professional";
import { filterProfessionals, listSpecialties, normalize } from "./professionals";

const professionals = data as Professional[];

describe("lógica de filtro da API simulada", () => {
  it("normaliza acentos e caixa", () => {
    expect(normalize("  SaÚDE  ")).toBe("saude");
  });

  it("sem filtros, retorna todos", () => {
    expect(filterProfessionals(professionals, {})).toHaveLength(professionals.length);
  });

  it("filtra por especialidade exata", () => {
    const result = filterProfessionals(professionals, { specialty: "Psicologia" });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => expect(p.specialty).toBe("Psicologia"));
  });

  it("combina termo e modalidade", () => {
    const result = filterProfessionals(professionals, { q: "sp", modality: "online" });
    result.forEach((p) => {
      expect(p.modalities).toContain("online");
    });
  });

  it("lista especialidades sem repetição e em ordem alfabética", () => {
    const specialties = listSpecialties(professionals);
    expect(new Set(specialties).size).toBe(specialties.length);
    expect([...specialties].sort((a, b) => a.localeCompare(b, "pt-BR"))).toEqual(specialties);
  });
});
