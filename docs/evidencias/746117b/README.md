# Evidências do commit `746117b`

- **Commit avaliado:** [`746117bde478944ab34e2d393459ba229cd66dda`](https://github.com/ffabricioffs/lacrei-desafio/commit/746117bde478944ab34e2d393459ba229cd66dda)
- **Gerado em:** 2026-11-24T00:04:34.901Z
- **Ambiente:** Google Chrome for Testing 153.0.8010.12 · Node v22.23.5 · Lighthouse 13.6.0 · build de produção (`next build` + `next start`) servido localmente
- **Como reproduzir:** `npm ci && npm run evidencias` (gera esta pasta para o commit atual)

> Estes números são do build de produção rodando **localmente**. As medições no domínio público da
> Vercel são feitas automaticamente pelo workflow [Produção](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml)
> a cada deploy (ver o resumo de cada execução).

## 1. Testes

```
Test Suites: 7 passed, 7 total
Tests:       71 passed, 71 total
```

Saída completa, com a lista de todos os testes e a cobertura: [testes/jest-saida.txt](testes/jest-saida.txt)

## 2. Lighthouse (duas páginas, mobile e desktop)

| Página | Perfil | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT | Relatório |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 97 | 100 | 100 | 100 | 2.2 s | 0 | 150 ms | [HTML](lighthouse/inicio-mobile.report.html) |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | [HTML](lighthouse/inicio-desktop.report.html) |
| `/profissionais` | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 90 ms | [HTML](lighthouse/profissionais-mobile.report.html) |
| `/profissionais` | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | [HTML](lighthouse/profissionais-desktop.report.html) |

Os arquivos HTML são os relatórios completos do Lighthouse (abra no navegador após baixar).

## 3. Responsividade ✅

| Página | Largura | Rolagem horizontal | Navegação | `h1` | Alvos < 24px | Captura |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 360px | não | botão de menu | 32px | 0 | [jpg](responsividade/inicio-360.jpg) |
| `/` | 375px | não | botão de menu | 32px | 0 | [jpg](responsividade/inicio-375.jpg) |
| `/` | 414px | não | botão de menu | 32px | 0 | [jpg](responsividade/inicio-414.jpg) |
| `/` | 768px | não | botão de menu | 32px | 0 | [jpg](responsividade/inicio-768.jpg) |
| `/` | 1024px | não | menu completo | 48px | 0 | [jpg](responsividade/inicio-1024.jpg) |
| `/` | 1440px | não | menu completo | 48px | 0 | [jpg](responsividade/inicio-1440.jpg) |
| `/profissionais` | 360px | não | botão de menu | 32px | 0 | [jpg](responsividade/profissionais-360.jpg) |
| `/profissionais` | 375px | não | botão de menu | 32px | 0 | [jpg](responsividade/profissionais-375.jpg) |
| `/profissionais` | 414px | não | botão de menu | 32px | 0 | [jpg](responsividade/profissionais-414.jpg) |
| `/profissionais` | 768px | não | botão de menu | 32px | 0 | [jpg](responsividade/profissionais-768.jpg) |
| `/profissionais` | 1024px | não | menu completo | 48px | 0 | [jpg](responsividade/profissionais-1024.jpg) |
| `/profissionais` | 1440px | não | menu completo | 48px | 0 | [jpg](responsividade/profissionais-1440.jpg) |

Larguras escolhidas pelos pontos de quebra do Marsha: mobile 360/375/414, tablet 768, desktop 1024/1440.
"Alvos < 24px" conta links, botões e campos visíveis menores que 24 × 24px (WCAG 2.5.8). Links no meio de
um parágrafo (ex.: cvv.org.br, commit no rodapé) ficam de fora por serem a exceção de texto corrido.

## 4. Conferência com o Marsha ✅

43 de 43 itens medidos conferem com o guia. Tabela completa: [marsha.md](marsha.md)

## 5. Contraste medido em cada estado ✅

33 de 33 medições atingem o mínimo WCAG AA. Tabela completa: [contraste.md](contraste.md)
