# Conferência com o Marsha Design System — commit `746117b`

Cada linha compara o **valor do guia** (Figma: variáveis e handoff) com o **estilo computado medido no Chrome** (`getComputedStyle`), no build de produção deste commit.
Gerado em 2026-11-24T00:04:34.901Z por `npm run evidencias`.

| Componente | Item | Guia (Figma) | Medido | Resultado |
| --- | --- | --- | --- | --- |
| Tipografia | Fonte do corpo | Nunito | `nunito, "nunito Fallback", system-ui, Arial, sans-serif, Nunito, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | ✅ |
| Tipografia | Cor do corpo | Text/body #2D2D2D | `rgb(45, 45, 45)` | ✅ |
| Tipografia | Corpo Text-base | 16px / 150% | `16px / 24px` | ✅ |
| Tipografia | h1 Headline-xl (375px) | 32px Bold | `32px 700` | ✅ |
| Tipografia | h1 cor (375px) | Text/heading #131313 | `rgb(19, 19, 19)` | ✅ |
| Tipografia | h2 Headline-lg (375px) | 24px Bold | `24px 700` | ✅ |
| Tipografia | h1 Headline-xl (1440px) | 48px Bold | `48px 700` | ✅ |
| Tipografia | h1 cor (1440px) | Text/heading #131313 | `rgb(19, 19, 19)` | ✅ |
| Tipografia | h2 Headline-lg (1440px) | 40px Bold | `40px 700` | ✅ |
| Botão primário | Fundo | accent #018762 | `rgb(1, 135, 98)` | ✅ |
| Botão primário | Texto | invert #FFFFFF | `rgb(255, 255, 255)` | ✅ |
| Botão primário | Altura | 48px | `48px` | ✅ |
| Botão primário | Raio | 8px | `8px` | ✅ |
| Botão primário | Fonte | 18px Bold | `18px 700` | ✅ |
| Botão primário | Padding horizontal | 32px (altura fixa de 48px) | `32px` | ✅ |
| Botão primário | Sombra | 0 5px 5px rgba(0,0,0,.3) | `rgba(0, 0, 0, 0.3) 0px 5px 5px 0px` | ✅ |
| Botão primário | Hover: fundo | accent-hover #007756 | `rgb(0, 119, 86)` | ✅ |
| Botão secundário | Borda | 2px #018762 | `2px rgb(1, 135, 98)` | ✅ |
| Botão secundário | Texto | accent #018762 | `rgb(1, 135, 98)` | ✅ |
| Botão secundário | Hover: fundo | success-hover #B2DFD0 | `rgb(178, 223, 208)` | ✅ |
| Botão secundário | Hover: borda | border-hover #29A480 | `rgb(41, 164, 128)` | ✅ |
| Botão secundário | Hover: texto (ajuste de contraste) | Figma #007756 → ajustado #014C37 | `rgb(1, 76, 55)` | ✅ |
| Foco | Anel de foco (logo, via Tab) | 2px blue-60 #28588A, afastado 4px | `2px solid rgb(40, 88, 138) / offset 4px` | ✅ |
| Foco | Anel de foco (botão primário, via Tab) | 2px blue-60 #28588A, afastado 4px | `2px solid rgb(40, 88, 138) / offset 4px` | ✅ |
| Header | Altura (desktop) | 96px | `96px` | ✅ |
| Header | Fundo | gradient-subtle #F5FFFB → #FFFFFF | `linear-gradient(rgb(245, 255, 251) 31%, rgb(255, 255, 255) 100%)` | ✅ |
| Header | Link: fonte | Button Link 18px Bold | `18px 700` | ✅ |
| Header | Link: altura mínima | 48px | `48px` | ✅ |
| Header | Link: texto (ajuste de contraste) | Figma #018762 → ajustado #007756 | `rgb(0, 119, 86)` | ✅ |
| Header | Link hover: fundo | #B2DFD0 | `rgb(178, 223, 208)` | ✅ |
| Header | Link hover: texto (ajuste de contraste) | Figma #007756 → ajustado #014C37 | `rgb(1, 76, 55)` | ✅ |
| Header | Logo oficial | logotipo horizontal (SVG do Figma) | `/brand/logo-lacrei-horizontal.svg` | ✅ |
| Header | Altura (mobile) | 96px | `96px` | ✅ |
| Footer | Divisória | 1px emerald-20 #B2DFD0 | `1px rgb(178, 223, 208)` | ✅ |
| Footer | Título de coluna | Text-xl-highlight 18px Bold #131313 | `18px 700 rgb(19, 19, 19)` | ✅ |
| Footer | Link (Secondary link) | 16px #2D2D2D, mín. 48px | `16px rgb(45, 45, 45) 48px` | ✅ |
| Footer | Voltar ao topo | Outline/Icon 48px, borda #29A480 | `48px rgb(41, 164, 128)` | ✅ |
| Footer | Logo empilhado | SVG do Figma | `/brand/logo-lacrei-empilhado.svg` | ✅ |
| Accordion | Título | text-base-highlight 16px Bold, text-body | `16px 700 rgb(45, 45, 45)` | ✅ |
| Accordion | Borda do item | Border/card #BFBFBF, raio 8px | `rgb(191, 191, 191) 8px` | ✅ |
| Input | Padrão | borda 2px, raio 8px, 48px | `2px 8px 48px` | ✅ |
| Input | Preenchido | color-border-hover #29A480 | `rgb(41, 164, 128)` | ✅ |
| Tag | Etiqueta do card | fundo #DFF2ED, cantos 4px, 14px | `rgb(223, 242, 237) 4px 14px` | ✅ |

**43 de 43 itens conferem.**

Os três itens marcados "ajuste de contraste" diferem do Figma **de propósito**: no guia, o texto
`#007756` sobre `#B2DFD0` (hover do Outline e do Button Link) tem 3,81:1, abaixo do AA (4,5:1).
Mantivemos o fundo do guia e usamos `#014C37` (6,87:1). No header, o texto padrão do link usa
`#007756` (5,45:1 sobre `#F5FFFB`), porque `#018762` sobre o degradê do header fica em 4,43:1.

## Capturas dos componentes (build deste commit)

| Componente | Arquivo |
| --- | --- |
| Header desktop | [marsha/header-desktop.png](marsha/header-desktop.png) |
| Header mobile (fechado / aberto) | [marsha/header-mobile.png](marsha/header-mobile.png) · [marsha/header-mobile-menu-aberto.png](marsha/header-mobile-menu-aberto.png) |
| Footer desktop / mobile | [marsha/footer-desktop.png](marsha/footer-desktop.png) · [marsha/footer-mobile.png](marsha/footer-mobile.png) |
| Botões (hover no secundário) | [marsha/hero-botoes-hover-secundario.png](marsha/hero-botoes-hover-secundario.png) |
| Accordion aberto | [marsha/acordeao-aberto.png](marsha/acordeao-aberto.png) |
| Input + filtros | [marsha/busca-formulario.png](marsha/busca-formulario.png) |
| Card com Tags | [marsha/card-profissional.png](marsha/card-profissional.png) |

Referências no Figma (arquivo `P4fEHULnr9okeGIT7p3P0G`): Cores `16298:3`, Tipografia `16298:82`,
Pontos de quebra `16791:12099`, Button `600:68`, Header `12126:7710`, Footer `12126:7709`,
Accordion `19362:4215`, Input `602:74`, Tags `29704:1100`.
