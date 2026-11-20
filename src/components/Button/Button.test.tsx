import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderWithTheme, screen } from "@/test-utils";
import { Button, ButtonLink } from "./Button";

describe("Button", () => {
  it("renderiza um <button> do tipo 'button' por padrão (não envia formulários sem querer)", () => {
    renderWithTheme(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("executa a ação ao clicar e ao usar o teclado", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    renderWithTheme(<Button onClick={onClick}>Confirmar</Button>);

    const button = screen.getByRole("button", { name: "Confirmar" });
    await user.click(button);
    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("não executa a ação quando desabilitado", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    renderWithTheme(
      <Button onClick={onClick} disabled>
        Enviar
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("não vaza props de estilo para o DOM", () => {
    renderWithTheme(<Button variant="secondary">Voltar</Button>);
    const button = screen.getByRole("button", { name: "Voltar" });
    expect(button).not.toHaveAttribute("variant");
    expect(button).not.toHaveAttribute("$variant");
  });
});

describe("ButtonLink", () => {
  it("navega para rotas internas com href correto", () => {
    renderWithTheme(<ButtonLink href="/profissionais">Buscar atendimento</ButtonLink>);
    expect(screen.getByRole("link", { name: "Buscar atendimento" })).toHaveAttribute(
      "href",
      "/profissionais",
    );
  });

  it("abre links externos em nova aba com rel seguro e aviso para leitores de tela", () => {
    renderWithTheme(
      <ButtonLink href="https://profissional.lacreisaude.com.br/" external>
        Oferecer atendimento
      </ButtonLink>,
    );
    const link = screen.getByRole("link", { name: /oferecer atendimento \(abre em nova aba\)/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("não tem violações de acessibilidade (axe)", async () => {
    const { container } = renderWithTheme(
      <div>
        <Button>Ação</Button>
        <ButtonLink href="/">Início</ButtonLink>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
