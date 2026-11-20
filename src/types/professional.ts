export type Modality = "online" | "presencial";

export interface Professional {
  id: string;
  name: string;
  pronouns: string;
  specialty: string;
  /** Registro profissional fictício (ex.: CRM, CRP) */
  registry: string;
  city: string;
  state: string;
  modalities: Modality[];
  tags: string[];
  bio: string;
  accessibility: string[];
}

export interface ProfessionalFilters {
  q?: string;
  specialty?: string;
  modality?: Modality | "";
}

export interface ProfessionalsResponse {
  data: Professional[];
  total: number;
  specialties: string[];
}
