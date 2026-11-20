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

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
