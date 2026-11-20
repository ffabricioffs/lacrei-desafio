import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { usePathname } from "next/navigation";
import { renderWithTheme, screen } from "@/test-utils";
import { Header, NAV_ITEMS } from "./Header";

const mockedUsePathname = usePathname as jest.Mock;

describe("Header", () => {
  beforeEach(() => mockedUsePathname.mockReturnValue("/"));

  it("renderiza o landmark banner com o logo apontando para a página inicial", () => {
    renderWithTheme(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Lacrei Saúde, ir para a página inicial" }),
    ).toHaveAttribute("href", "/");
  });

  it("exibe todos os links da navegação principal", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    // No jsdom não há media queries: o layout é o mobile, então abrimos o menu
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    NAV_ITEMS.forEach((item) => {
      expect(nav).toContainElement(screen.getByRole("link", { name: item.label }));
    });
  });

  it("marca a página atual com aria-current", () => {
    mockedUsePathname.mockReturnValue("/profissionais");
    renderWithTheme(<Header />);
    expect(screen.getByRole("link", { name: "Buscar profissionais", hidden: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Início", hidden: true })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("abre e fecha o menu mobile atualizando aria-expanded e o rótulo", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Fechar menu");

    const controlledId = toggle.getAttribute("aria-controls");
    expect(document.getElementById(controlledId!)).toBe(
      screen.getByRole("navigation", { name: "Navegação principal" }),
    );

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("fecha o menu com Esc e devolve o foco ao botão", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(toggle);
    await user.tab();
    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(<Header />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
