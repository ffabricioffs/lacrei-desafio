import type { Metadata } from "next";
import { ProfessionalSearch } from "@/components/ProfessionalSearch/ProfessionalSearch";
import { ProfessionalsIntro, SearchContainer } from "@/components/ProfessionalsPage/ProfessionalsIntro";

export const metadata: Metadata = {
  title: "Buscar profissionais",
  description:
    "Busque profissionais de saúde por especialidade, cidade e modalidade de atendimento, online ou presencial.",
};

export default function ProfessionalsPage() {
  return (
    <>
      <ProfessionalsIntro />
      <SearchContainer>
        <ProfessionalSearch />
      </SearchContainer>
    </>
  );
}
