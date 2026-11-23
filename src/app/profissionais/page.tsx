import type { Metadata } from "next";
import data from "@/data/profissionais.json";
import { ProfessionalSearch } from "@/components/ProfessionalSearch/ProfessionalSearch";
import { ProfessionalsIntro, SearchContainer } from "@/components/ProfessionalsPage/ProfessionalsIntro";
import { filterProfessionals, listSpecialties } from "@/lib/professionals";
import type { Professional, ProfessionalsResponse } from "@/types/professional";

export const metadata: Metadata = {
  title: "Buscar profissionais",
  description:
    "Busque profissionais de saúde por especialidade, cidade e modalidade de atendimento, online ou presencial.",
};

const professionals = data as Professional[];

/** Mesmo resultado que GET /api/profissionais sem filtros, calculado no build */
const initialData: ProfessionalsResponse = {
  data: filterProfessionals(professionals, {}),
  total: professionals.length,
  specialties: listSpecialties(professionals),
};

export default function ProfessionalsPage() {
  return (
    <>
      <ProfessionalsIntro />
      <SearchContainer>
        <ProfessionalSearch initialData={initialData} />
      </SearchContainer>
    </>
  );
}
