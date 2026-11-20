import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import data from "@/data/profissionais.json";
import { filterProfessionals, listSpecialties } from "@/lib/professionals";
import { renderWithTheme, screen, waitFor, within } from "@/test-utils";
import type { Professional, ProfessionalsResponse } from "@/types/professional";
import { ProfessionalSearch } from "./ProfessionalSearch";

const professionals = data as Professional[];

/** Simula a API: aplica os mesmos filtros do route handler sobre o JSON local */
function mockApi() {
  return jest.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input), "http://localhost");
    const result = filterProfessionals(professionals, {
      q: url.searchParams.get("q") ?? "",
      specialty: url.searchParams.get("especialidade") ?? "",
      modality: (url.searchParams.get("modalidade") ?? "") as Professional["modalities"][number],
    });
    const body: ProfessionalsResponse = {
      data: result,
      total: result.length,
      specialties: listSpecialties(professionals),
    };
    return { ok: true, status: 200, json: async () => body } as Response;
  });
}

describe("ProfessionalSearch", () => {
  let fetchMock: ReturnType<typeof mockApi>;

  beforeEach(() => {
    fetchMock = mockApi();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("carrega e lista os profissionais da API, anunciando o total", async () => {
    renderWithTheme(<ProfessionalSearch />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando profissionais…");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        `${professionals.length} profissionais encontrados`,
      ),
    );
    expect(screen.getAllByRole("article")).toHaveLength(professionals.length);
    expect(fetchMock).toHaveBeenCalledWith("/api/profissionais", expect.anything());
  });

  it("busca por texto ao enviar o formulário, sem diferenciar acentos", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfessionalSearch />);
    await screen.findByText(`${professionals.length} profissionais encontrados`);

    await user.type(screen.getByLabelText("Nome, especialidade, cidade ou tema"), "hormonizacao");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        "/api/profissionais?q=hormonizacao",
        expect.anything(),
      ),
    );
    const expected = filterProfessionals(professionals, { q: "hormonização" });
    expect(await screen.findAllByRole("article")).toHaveLength(expected.length);
  });

  it("filtra por modalidade imediatamente ao escolher a opção", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfessionalSearch />);
    await screen.findByText(`${professionals.length} profissionais encontrados`);

    await user.click(screen.getByRole("radio", { name: "Online" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        "/api/profissionais?modalidade=online",
        expect.anything(),
      ),
    );
    const articles = await screen.findAllByRole("article");
    articles.forEach((article) => expect(within(article).getByText("Online")).toBeInTheDocument());
  });

  it("mostra estado vazio e permite limpar os filtros", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfessionalSearch />);
    await screen.findByText(`${professionals.length} profissionais encontrados`);

    const input = screen.getByLabelText("Nome, especialidade, cidade ou tema");
    await user.type(input, "termo que não existe");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(await screen.findByText(/nenhum profissional corresponde/i)).toBeInTheDocument();

    const clearButtons = screen.getAllByRole("button", { name: "Limpar filtros" });
    await user.click(clearButtons[clearButtons.length - 1]);

    expect(await screen.findByText(`${professionals.length} profissionais encontrados`)).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("exibe erro com alerta e tenta novamente", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    renderWithTheme(<ProfessionalSearch />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/problema de conexão/i);

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText(`${professionals.length} profissionais encontrados`)).toBeInTheDocument();
  });

  it("expande os detalhes do card com aria-expanded", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfessionalSearch />);
    const [firstCard] = await screen.findAllByRole("article");

    const toggle = within(firstCard).getByRole("button", { name: /ver detalhes/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(within(firstCard).getByText("Acessibilidade no atendimento")).toBeVisible();
  });

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(<ProfessionalSearch />);
    await screen.findByText(`${professionals.length} profissionais encontrados`);
    expect(await axe(container)).toHaveNoViolations();
  });
});
