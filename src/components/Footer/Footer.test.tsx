import { axe } from "jest-axe";
import { renderWithTheme, screen, within } from "@/test-utils";
import { Footer, FOOTER_SECTIONS } from "./Footer";

describe("Footer", () => {
  it("renderiza o landmark contentinfo", () => {
    renderWithTheme(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("agrupa os links em navegações rotuladas pelo título de cada coluna", () => {
    renderWithTheme(<Footer />);
    FOOTER_SECTIONS.forEach((section) => {
      const nav = screen.getByRole("navigation", { name: section.title });
      expect(within(nav).getAllByRole("link")).toHaveLength(section.links.length);
    });
  });

  it("links externos abrem em nova aba com rel seguro e avisam o leitor de tela", () => {
    renderWithTheme(<Footer />);
    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent("(abre em nova aba)");
    });
  });

  it("links internos usam rotas do app", () => {
    renderWithTheme(<Footer />);
    expect(screen.getByRole("link", { name: "Buscar atendimento" })).toHaveAttribute(
      "href",
      "/profissionais",
    );
  });

  it("exibe o aviso de emergência e o contato do CVV", () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/não oferece atendimento de emergência/i)).toBeInTheDocument();
    expect(screen.getByText("188")).toBeInTheDocument();
  });

  it("lista as redes sociais com nomes acessíveis, já que os links são só ícones", () => {
    renderWithTheme(<Footer />);
    const social = screen.getByRole("list", { name: "Redes sociais e contato" });
    const links = within(social).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(within(social).getByRole("link", { name: /Instagram da Lacrei Saúde/ })).toHaveAttribute(
      "href",
      "https://www.instagram.com/lacrei.saude",
    );
    // E-mail abre o cliente de e-mail, não uma nova aba
    const email = within(social).getByRole("link", { name: "E-mail da Lacrei Saúde" });
    expect(email).toHaveAttribute("href", "mailto:contato@lacreisaude.com.br");
    expect(email).not.toHaveAttribute("target");
  });

  it("tem o botão Voltar ao topo apontando para o início da página", () => {
    renderWithTheme(<Footer />);
    expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute("href", "#topo");
  });

  it("identifica o commit publicado com link para o GitHub", () => {
    renderWithTheme(<Footer />);
    const versao = screen.getByTestId("versao-publicada");
    const link = within(versao).getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/github\.com\/ffabricioffs\/lacrei-desafio\/commit\//),
    );
    expect(link).toHaveTextContent(/commit \S+/);
  });

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
