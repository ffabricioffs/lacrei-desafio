import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderWithTheme, screen } from "@/test-utils";
import { Accordion, type AccordionItem } from "./Accordion";

const items: AccordionItem[] = [
  { id: "a", title: "Primeira pergunta", content: <p>Primeira resposta</p> },
  { id: "b", title: "Segunda pergunta", content: <p>Segunda resposta</p> },
];

describe("Accordion", () => {
  it("começa com os painéis fechados", () => {
    renderWithTheme(<Accordion items={items} />);
    screen.getAllByRole("button").forEach((button) => {
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
    expect(screen.queryByText("Primeira resposta")).not.toBeVisible();
  });

  it("abre e fecha o painel ao clicar, ligando botão e região por ARIA", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Accordion items={items} />);

    const trigger = screen.getByRole("button", { name: "Primeira pergunta" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const region = screen.getByRole("region", { name: "Primeira pergunta" });
    expect(region).toHaveAttribute("id", trigger.getAttribute("aria-controls"));
    expect(screen.getByText("Primeira resposta")).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("permite vários itens abertos ao mesmo tempo e funciona pelo teclado", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Accordion items={items} />);

    await user.tab();
    await user.keyboard("{Enter}");
    await user.tab();
    await user.keyboard(" ");

    expect(screen.getByText("Primeira resposta")).toBeVisible();
    expect(screen.getByText("Segunda resposta")).toBeVisible();
  });

  it("respeita o nível de cabeçalho informado", () => {
    renderWithTheme(<Accordion items={items} headingLevel={2} />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(<Accordion items={items} defaultOpenId="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
