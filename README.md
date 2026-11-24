# Lacrei Saúde · Desafio Técnico Front-end

[![CI](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/ci.yml)
[![Produção](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml/badge.svg)](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml)
![Testes](https://img.shields.io/badge/testes-71%20passando-brightgreen)

> Os selos de CI e Produção mostram o resultado da última execução real de cada workflow. Os números de
> Lighthouse e testes citados neste README vêm das [evidências do commit `746117b`](docs/evidencias/746117b/README.md),
> salvo quando o texto indicar outra fonte.

Duas páginas interativas, acessíveis e responsivas que seguem a identidade visual da Lacrei Saúde (Marsha Design System), construídas com **Next.js 16 + TypeScript + Styled-Components**.

- **Deploy:** https://lacrei-desafio-mu.vercel.app
- **Repositório:** https://github.com/ffabricioffs/lacrei-desafio
- **Commit publicado:** aparece no rodapé do site ("Versão publicada: commit …") e em <https://lacrei-desafio-mu.vercel.app/api/versao>
- **Evidências (testes, Lighthouse, responsividade, Marsha, contraste):** [`docs/evidencias/746117b/`](docs/evidencias/746117b/README.md)

| Página | Rota | O que faz |
| --- | --- | --- |
| Início | `/` | Apresentação, "como funciona", público-alvo e perguntas frequentes (acordeão) |
| Buscar profissionais | `/profissionais` | Busca com filtros consumindo uma **API simulada** (`/api/profissionais`) |
| 404 | qualquer outra | Página de erro com caminho de volta ao início |

<p>
  <img src="docs/evidencias/746117b/responsividade/inicio-375.jpg" alt="Página inicial no celular, 375px" width="200" />
  <img src="docs/evidencias/746117b/responsividade/profissionais-1440.jpg" alt="Busca de profissionais no desktop, 1440px" width="580" />
</p>

---

## Sumário

0. [Revisão após a devolutiva (23/11/2026)](#revisão-após-a-devolutiva-23112026)
1. [Como rodar localmente](#como-rodar-localmente)
2. [Scripts](#scripts)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Fluxo navegável e botões interativos](#fluxo-navegável-e-botões-interativos)
5. [Acessibilidade](#acessibilidade)
6. [Performance](#performance)
7. [Testes (registro)](#testes-registro)
8. [Mock de integração com API](#mock-de-integração-com-api)
9. [Build e deploy (Vercel)](#build-e-deploy-vercel)
10. [Rollback](#rollback)
11. [Justificativas visuais e técnicas](#justificativas-visuais-e-técnicas)
12. [Checklist dos critérios de aceite](#checklist-dos-critérios-de-aceite)

**Legenda usada neste README:** **Medido** = resultado de uma execução registrada, com commit e arquivo de origem.
**Configurado** = regra ou automação que existe no repositório ou no painel, descrita como está, sem prometer
mais do que ela faz. **Documentado** = procedimento descrito, mas não executado neste projeto.

---

## Revisão após a devolutiva (23/11/2026)

| # | Ajuste pedido | O que foi feito | Onde conferir |
| --- | --- | --- | --- |
| 1 | Contraste do hover (secundário, ghost e navegação) | O texto no hover passou de `#007756` para `#014C37` sobre o mesmo fundo `#B2DFD0`: de 3,81:1 para **6,87:1**. O link do menu em repouso usa `#007756` sobre o fundo do header (**5,45:1**). Todos os pares de cor dos estados interativos ficam num só arquivo, testado contra o mínimo WCAG | [`contraste.md`](docs/evidencias/746117b/contraste.md) (medido no navegador, 33/33) · `src/styles/interactionStates.ts` + teste |
| 2 | Saída dos testes e Lighthouse das duas páginas, com o commit | Saída completa do Jest e os 4 relatórios HTML (2 páginas × mobile/desktop) do commit `746117b`. O CI também guarda a saída dos testes e os relatórios Lighthouse de **cada** commit como artefatos com o SHA no nome | [`testes/jest-saida.txt`](docs/evidencias/746117b/testes/jest-saida.txt) · [`lighthouse/`](docs/evidencias/746117b/README.md#2-lighthouse-duas-páginas-mobile-e-desktop) · [execuções do CI](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/ci.yml) |
| 3 | Evidências de responsividade e comparação com o Marsha | Capturas de página inteira em 360, 375, 414, 768, 1024 e 1440px, com rolagem horizontal, modo do menu, tamanho do `h1` e alvos pequenos medidos. Conferência de 43 itens (estilo computado × valor do Figma) e capturas dos componentes | [Responsividade](docs/evidencias/746117b/README.md#3-responsividade-) · [`marsha.md`](docs/evidencias/746117b/marsha.md) |
| 4 | Funcionamento do deploy e commit publicado | O rodapé e `/api/versao` mostram o commit em produção. O workflow **Produção** roda quando a Vercel conclui o deploy da `main`: confere que `/api/versao` responde com o commit esperado, testa as rotas e roda o Lighthouse na URL pública. A lista de `/profissionais` passou a vir no HTML, para ferramentas que não executam JavaScript | [Build e deploy](#build-e-deploy-vercel) · [execuções do workflow Produção](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml) |
| 5 | Separar resultados medidos de expectativas | Este README marca o que foi **medido** (com commit e arquivo), o que está **configurado** e o que está apenas **documentado**. Saíram a frase sobre a Vercel "tender a números melhores" e a afirmação de que o fluxo seria "garantido" pela proteção de branch | [Performance](#performance) · [Rollback](#rollback) |

Além disso, a medição apontou duas diferenças pequenas em relação ao guia, já corrigidas: botões com 55px de
altura (agora 48px) e header com 97px (agora 96px). O link "Início" da trilha de navegação passou a ter 24px de
altura, o mínimo do WCAG 2.5.8.

**Como reproduzir as evidências:** `npm ci && npm run evidencias` gera `docs/evidencias/<commit>/` para o commit
atual (o script se recusa a rodar com código não commitado, para que o SHA no nome da pasta seja o do código medido).

## Como rodar localmente

**Pré-requisitos:** Node.js 20.9 ou superior (recomendado: 22 LTS) e npm.

```bash
git clone https://github.com/ffabricioffs/lacrei-desafio.git
cd lacrei-desafio
npm install
npm run dev
```

Acesse <http://localhost:3000>. Não há variáveis de ambiente obrigatórias.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção (porta 3000) |
| `npm run lint` | ESLint (regras `next/core-web-vitals` + TypeScript) |
| `npm run typecheck` | Checagem de tipos com `tsc` |
| `npm test` | Testes unitários (Jest + Testing Library + jest-axe) |
| `npm run test:coverage` | Testes com relatório de cobertura em `coverage/` |
| `npm run ci` | Lint, tipos, testes e build em sequência (o mesmo que o CI roda) |
| `npm run lighthouse` | Lighthouse na URL local (com `npm start` rodando em outro terminal) |
| `npm run evidencias` | Gera `docs/evidencias/<commit>/`: saída dos testes, Lighthouse das duas páginas, capturas responsivas, conferência com o Marsha e contraste medido (precisa do Google Chrome instalado) |

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx              # HTML base (lang pt-BR), fonte, Header, <main>, Footer
│   ├── page.tsx                # Página inicial
│   ├── profissionais/page.tsx  # Página de busca
│   ├── api/profissionais/      # Route Handler: API simulada
│   ├── api/versao/             # Commit, branch e horário do build publicado
│   ├── not-found.tsx           # 404
│   └── fonts/                  # Nunito auto-hospedada (.woff2)
├── components/
│   ├── Button/                 # Button e ButtonLink (+ testes)
│   ├── Header/                 # Header com menu mobile acessível (+ testes)
│   ├── Footer/                 # Footer com aviso de emergência e CVV (+ testes)
│   ├── Accordion/              # Acordeão WAI-ARIA (+ testes)
│   ├── ProfessionalSearch/     # Busca com filtros e estados (+ testes)
│   ├── ProfessionalCard/       # Card com detalhes expansíveis
│   ├── Home/                   # Seções da página inicial
│   └── ui/                     # Container, VisuallyHidden, SkipLink…
├── data/profissionais.json     # Dados fictícios
├── lib/                        # Registry do styled-components, lógica de filtro e dados do build
├── services/professionals.ts   # Cliente HTTP da API
├── styles/                     # Tema (tokens Marsha), estilos globais e pares de cor dos estados
└── types/
scripts/                        # evidencias.mjs e resumo do Lighthouse CI
docs/evidencias/<commit>/       # Evidências geradas por commit
.github/workflows/              # ci.yml (PR e push) e producao.yml (após o deploy da Vercel)
```

## Fluxo navegável e botões interativos

1. **Início → Busca:** "Buscar atendimento" (hero e header) e "Encontrar profissionais" levam a `/profissionais` via `next/link` (navegação client-side com prefetch).
2. **Âncora:** "Entenda como funciona" rola até a seção `#como-funciona`, com rolagem suave apenas se a pessoa não pediu menos movimento (`prefers-reduced-motion`).
3. **Busca → Início:** breadcrumb, logo e links do header/footer.

Botões com **ação real**:

| Botão | Ação |
| --- | --- |
| Menu (mobile) | Abre/fecha a navegação (`aria-expanded`, `aria-controls`, Esc fecha e devolve o foco) |
| Buscar | Envia o formulário e consulta a API |
| Online / Presencial / Todas | Filtra os resultados na hora (rádios nativos com visual de chip) |
| Limpar filtros | Restaura a busca e devolve o foco ao campo de texto |
| Ver detalhes | Expande bio e recursos de acessibilidade do profissional |
| Tentar novamente | Refaz a requisição após um erro |
| Perguntas frequentes | Acordeão que abre/fecha cada resposta |

## Acessibilidade

**Medido:** Lighthouse **100** em acessibilidade nas duas páginas, mobile e desktop (commit `746117b`, build de produção local, [relatórios](docs/evidencias/746117b/README.md#2-lighthouse-duas-páginas-mobile-e-desktop)). O mínimo exigido é 90. O CI repete essa medição em cada PR e falha abaixo de 90.

O que foi aplicado:

- **HTML semântico:** `header`, `nav` (com rótulos distintos), `main`, `section` com `aria-labelledby`, `article` para cada profissional, `footer`, listas reais (`ul`/`ol`), um único `h1` por página e hierarquia de títulos sem saltos.
- **Teclado:** link "Pular para o conteúdo principal" como primeiro item focável; foco sempre visível (anel de 2px `#28588A` afastado 4px, como no Marsha); ordem de tabulação seguindo a ordem visual; Esc fecha o menu.
- **ARIA só onde o HTML não basta:** `aria-expanded`/`aria-controls` (menu, acordeão, detalhes do card), `aria-current="page"` (link ativo), `role="status"` + `aria-live="polite"` (total de resultados), `role="alert"` (erro), `role="search"` (formulário de busca).
- **Leitores de tela:** links externos avisam "(abre em nova aba)"; botões "Ver detalhes" incluem o nome da pessoa em texto oculto ("Ver detalhes de Dra. Helena Duarte"); ilustrações decorativas com `alt=""`.
- **Formulário:** `label` associado a cada campo, dica ligada por `aria-describedby`, rádios nativos agrupados em `fieldset`/`legend`.
- **Contraste (WCAG AA):** verde `#018762` sobre branco = 4,52:1; títulos `#131313` = 18,6:1; corpo `#2D2D2D` = 13,8:1; texto de apoio `#515151` = 7,9:1; anel de foco `#28588A` = 7,4:1. **Estados de hover:** botões secundário e ghost e links do menu usam `#014C37` sobre `#B2DFD0` = 6,87:1; botão primário branco sobre `#007756` = 5,57:1. Cada par está em `src/styles/interactionStates.ts`; o teste `interactionStates.test.ts` reprova qualquer par abaixo de 4,5:1 (texto) ou 3:1 (ícone), e o script de evidências mede os estados padrão, hover e foco no navegador ([contraste.md](docs/evidencias/746117b/contraste.md)).
- **Alvos de toque:** botões e links de navegação com 48px de altura; o link da trilha de navegação com 24px. Nenhum alvo abaixo de 24 × 24px nas 12 combinações de página × largura medidas (links no meio de um parágrafo são a exceção de texto corrido do WCAG 2.5.8).
- **Movimento reduzido:** animações e rolagem suave desligadas com `prefers-reduced-motion: reduce`.
- **Testes automatizados com `jest-axe`** em todos os componentes testados (zero violações).

### Teste com leitor de tela

Teste manual feito em **20/11/2026** e repetido em **21/11/2026**, depois do alinhamento ao Figma, com **NVDA + Microsoft Edge (Windows 11)** no deploy de produção, acompanhando o Visualizador de fala do NVDA.

| Verificação | O que o NVDA anunciou | Resultado |
| --- | --- | --- |
| Link de pular conteúdo | "mesma página, link, Pular para o conteúdo principal" como primeiro item; Enter leva ao `#conteudo` e o próximo Tab cai no breadcrumb, sem passar pelo menu | ✅ |
| Marcos (Insert + F7) | báner › Navegação principal; principal › Como funciona, Para quem é a Lacrei Saúde, Perguntas frequentes; conteúdo (rodapé) › Lacrei Saúde, Saúde, Segurança e privacidade | ✅ |
| Títulos (Insert + F7) | Um único `h1`, seções em `h2` e subitens em `h3`, sem saltos de nível | ✅ |
| Pergunta frequente | "título nível 3, expandido", depois "região" com a resposta | ✅ |
| Zoom de 200% | Layout vira o de celular, sem cortes nem rolagem horizontal | ✅ |
| Menu mobile | "botão, recolhido, Abrir menu" → Enter: "Fechar menu, expandido" → Esc: "Abrir menu, recolhido", com o foco de volta no botão | ✅ |
| Campo de busca | "busca, marco, Nome, especialidade, cidade ou tema, edição, A busca não diferencia acentos nem maiúsculas" | ✅ |
| Total de resultados (região de status) | "Carregando profissionais…" e "2 profissionais encontrados", sem mover o foco | ✅ |
| Filtro de modalidade | "Modalidade de atendimento, grupo, Todas, botão de opção…"; ao marcar, anuncia o novo total | ✅ |
| "Ver detalhes" do card | "Ver detalhes de Dre. Caio Nascimento, botão, recolhido" → "expandido" | ✅ (após correção) |
| Link externo | "Oferecer atendimento (abre em nova aba)" | ✅ (após correção) |
| Logo oficial (SVG) no header | "link, Lacrei Saúde, ir para a página inicial": a imagem não interfere no nome do link | ✅ |
| Redes sociais (links só com ícone) | "Facebook da Lacrei Saúde (abre em nova aba)", "Instagram…", "LinkedIn…" e "E-mail da Lacrei Saúde", este sem aviso de nova aba | ✅ |
| Lista de links (Insert + F7) | 25 links, todos com nome claro; os externos com "(abre em nova aba)" | ✅ |
| "Voltar ao topo" | "Voltar ao topo; mesma página". Ao ativar, a página volta ao topo e o cursor do NVDA vai para o banner/logo | ✅ |

**Problemas encontrados no teste manual e corrigidos:**

1. **Palavras grudadas no texto oculto.** O NVDA lia "Ver detalhes**de** Dre. Caio" e "Oferecer atendimento**(abre em nova aba)**". O texto exclusivo para leitores de tela usa `position: absolute`, e o navegador descartava o espaço inicial ao montar o nome acessível. A correção foi começar esse texto com espaço não separável (`\u00A0`), e um teste de regressão garante isso.
2. **Leitura longa ao pular para o conteúdo.** Com `tabIndex={-1}` no `<main>`, o NVDA lia a página inteira ao ativar "Pular para o conteúdo". O `tabindex` foi removido: o link de âncora já move o ponto de partida da navegação por teclado para o início do conteúdo. Reconferido em 21/11: ao ativar o link, o NVDA lê apenas "título, nível 1, Cuidado em saúde com respeito e segurança".

**Observações (não são defeitos):**

- Na Lista de elementos do NVDA no Edge, a seção do topo (com o `h1`) não aparece entre os marcos, embora esteja exposta como região com nome na árvore de acessibilidade do navegador. Ela continua acessível pela navegação por títulos.
- Se o foco sai do navegador logo após um filtro, o NVDA descarta o aviso da região de status. Esse é o comportamento esperado dele para janelas em segundo plano.

## Performance

**Medido no build de produção local** (commit `746117b`, Lighthouse 13.6, Chrome 153; mínimo exigido: 80):

| Página | Mobile | Desktop | LCP (mobile) | CLS | TBT (mobile) |
| --- | --- | --- | --- | --- | --- |
| `/` | 97 | 100 | 2,2 s | 0 | 150 ms |
| `/profissionais` | 100 | 100 | 0,8 s | 0 | 90 ms |

Relatórios completos: [`docs/evidencias/746117b/lighthouse/`](docs/evidencias/746117b/README.md#2-lighthouse-duas-páginas-mobile-e-desktop). Em execuções
anteriores, a performance mobile de `/` variou entre 96 e 100; o número acima é o da execução registrada.

**Na Vercel:** este README não supõe que os números na URL pública sejam iguais ou melhores. Eles são **medidos**
pelo workflow [Produção](https://github.com/ffabricioffs/lacrei-desafio/actions/workflows/producao.yml) depois de cada
deploy da `main` (3 execuções por página, perfil mobile do Lighthouse, a partir de um runner do GitHub). O resumo de
cada execução traz a tabela com os números e o commit, e os relatórios ficam como artefato
`lighthouse-producao-<commit>`. Os números da Vercel variam com a rede entre o runner e a CDN.

- **Páginas pré-renderizadas** (estáticas) no build. Só a API roda sob demanda.
- **Imagens:** `next/image` com `width`/`height` (sem layout shift); a ilustração abaixo da dobra usa `loading="lazy"`; a do hero usa `loading="eager"` + `fetchPriority="high"` por ser candidata a LCP. As ilustrações são SVGs leves (menos de 2 KB cada).
- **Fonte auto-hospedada** com `next/font/local` (Nunito 400/600/700 em `.woff2`, só subset latino), com `display: swap` e preload automático. Nenhuma requisição a servidores de terceiros.
- **Bundle enxuto:** sem bibliotecas de UI, ícones ou utilitários extras. Ícones são SVG inline. O plugin SWC do styled-components minifica o CSS e remove espaços em branco.
- **Requisições canceláveis:** a busca usa `AbortController`, então filtros trocados rapidamente não disputam a resposta.
- **Cache HTTP** na API simulada (`max-age=60, stale-while-revalidate=300`).

## Testes (registro)

Jest 30 + React Testing Library + `@testing-library/user-event` + `jest-axe`. **Medido:** 71 testes em 7 suítes, todos passando (commit `746117b`, [saída completa](docs/evidencias/746117b/testes/jest-saida.txt)).

```bash
npm test               # roda tudo
npm run test:coverage  # com cobertura
```

| Suíte | Componente | O que é verificado |
| --- | --- | --- |
| `Button.test.tsx` | **Navegação (botões/links)** | `type="button"` por padrão, clique + Enter + Espaço, estado desabilitado, props de estilo não vazam para o DOM, `href` interno, link externo com `target`/`rel` seguro e aviso para leitor de tela, axe |
| `Header.test.tsx` | **Header** | Landmark `banner`, logo leva ao início, todos os links da navegação, `aria-current` na página atual, menu mobile com `aria-expanded`/`aria-controls`/rótulo dinâmico, Esc fecha e devolve o foco, axe |
| `Footer.test.tsx` | **Footer** | Landmark `contentinfo`, navegações rotuladas por coluna, links externos seguros, rotas internas, redes sociais com nome acessível, "voltar ao topo", aviso de emergência e CVV 188, link do commit publicado, axe |
| `Accordion.test.tsx` | **Conteúdo interativo** | Começa fechado, abre/fecha com ligação botão ↔ região, vários abertos, uso só por teclado, nível de título configurável, axe |
| `ProfessionalSearch.test.tsx` | **Conteúdo interativo + API** | Carregamento e total anunciado, busca sem acento, filtro por modalidade, estado vazio + limpar filtros (foco volta ao campo), erro com `role="alert"` + tentar novamente, expandir detalhes do card, resultado inicial vindo do servidor sem nova requisição, axe |
| `interactionStates.test.ts` | **Contraste dos estados** | Cada par de cor (padrão, hover, pressionado, foco) de botões, links do menu e do rodapé, acordeão, chips e ícones atinge 4,5:1 (texto) ou 3:1 (ícone); nenhum hover usa o par `#007756`/`#B2DFD0` |
| `professionals.test.ts` | Lógica da API | Normalização de acentos, filtros por termo, especialidade e modalidade, lista de especialidades |

Cobertura medida dos componentes testados (linhas): Accordion, Footer, ProfessionalCard e a lógica de filtro em 100%; ProfessionalSearch 99,7%; Header 98,9%; Button 97,2%.

**Integração contínua (configurado)**, em `.github/workflows/ci.yml`, a cada push e PR:

1. **"Lint, tipos, testes e build":** roda lint, tipos, testes com cobertura e build. A saída completa do Jest vai para o resumo da execução e para o artefato `testes-<commit>`.
2. **"Lighthouse (a11y ≥ 90, performance ≥ 80)":** Lighthouse CI (`lighthouserc.json`, 3 execuções por página) sobre o build de produção. Falha se acessibilidade ficar abaixo de 90 ou performance abaixo de 80 em qualquer página. A tabela com os números vai para o resumo, e os relatórios HTML/JSON para o artefato `lighthouse-ci-<commit>`.

Os artefatos ficam disponíveis por 30 dias na página de cada execução. Por isso, as evidências do commit
entregue também estão versionadas em `docs/evidencias/<commit>/`, que não expiram.

## Mock de integração com API

`GET /api/profissionais?q=&especialidade=&modalidade=`

```json
{
  "data": [{ "id": "1", "name": "Dra. Helena Duarte", "pronouns": "ela/dela", "specialty": "Clínica geral", "...": "..." }],
  "total": 10,
  "specialties": ["Clínica geral", "Dermatologia", "..."]
}
```

- Implementada como **Route Handler** do Next.js lendo `src/data/profissionais.json`, então funciona igual em dev, nos testes e no Vercel, sem serviço externo.
- A busca ignora acentos e maiúsculas, e os parâmetros são validados (modalidade só aceita `online`/`presencial`; termo limitado a 100 caracteres).
- O front só conhece a API por meio de `src/services/professionals.ts`. Para trocar pelo Back-end real, basta mudar a URL nesse arquivo.
- A interface trata os três estados: **carregando** (skeleton + "Carregando profissionais…"), **erro** (alerta + "Tentar novamente") e **vazio** (mensagem + "Limpar filtros").
- Os perfis são **fictícios** (registros terminados em "(fictício)") e a página avisa isso.

## Build e deploy (Vercel)

**Build local:**

```bash
npm run build && npm start
```

**Deploy pelo painel (recomendado):**

1. Suba o repositório para o GitHub (público).
2. Em <https://vercel.com/new>, importe o repositório. O Vercel detecta o Next.js sozinho, sem nenhuma configuração extra.
3. Clique em **Deploy**. A URL de produção fica disponível ao final.
4. A partir daí, cada push na `main` gera um deploy de **produção** e cada Pull Request gera um **Preview Deploy** com URL própria.

**Como este projeto está publicado (configurado):** integração Git da Vercel com este repositório. Cada push na
`main` gera um deploy de produção em <https://lacrei-desafio-mu.vercel.app>. O domínio de produção é público, sem
login. Os Preview Deploys de PR exigem login na Vercel (proteção padrão do projeto), então não servem como link
público para avaliação.

**Como saber qual commit está no ar:**

- Rodapé do site: "Versão publicada: commit `xxxxxxx`", com link para o commit no GitHub.
- `GET /api/versao` responde, por exemplo:

  ```json
  {"commit":"<sha completo>","commitCurto":"xxxxxxx","branch":"main","ambiente":"production","geradoEm":"…","commitUrl":"https://github.com/…/commit/<sha>"}
  ```

- No GitHub, o commit da `main` recebe o status "Vercel" quando o deploy termina.

**Verificação automática após cada deploy (configurado):** o workflow `.github/workflows/producao.yml` roda quando a
Vercel marca o commit da `main` como publicado. Ele:

1. consulta `/api/versao` até a resposta trazer o mesmo commit (até 5 minutos);
2. confere com `curl`, sem JavaScript, que `/` traz o título principal, que `/profissionais` já traz "10 profissionais
   encontrados" no HTML, que `/api/profissionais?modalidade=online` responde com 8 resultados e que uma rota
   inexistente responde 404;
3. registra os cabeçalhos de segurança da resposta;
4. roda o Lighthouse nas duas páginas da URL pública e falha abaixo de 90 (acessibilidade) ou 80 (performance).

O resultado fica no resumo da execução, com o commit verificado. Se algum passo falhar, a execução fica vermelha e
o selo "Produção" no topo deste README também. Esse workflow **verifica** o deploy; ele não impede nem desfaz uma
publicação.

**Se uma ferramenta não conseguir abrir o site:** o domínio não tem firewall, desafio de bot nem login. Se a
ferramenta não executa JavaScript, as páginas ainda chegam completas no HTML (inclusive a lista de profissionais).
O resumo do workflow Produção mostra a resposta de cada rota obtida de fora da Vercel.

**Deploy pela CLI:**

```bash
npm i -g vercel
vercel            # primeiro deploy (preview) e vínculo do projeto
vercel --prod     # promove para produção
```

## Rollback

> **Status: documentado, não executado.** Os procedimentos abaixo seguem a documentação da Vercel. Nenhum
> rollback foi feito em produção neste projeto, então não há medição de tempo nem registro de execução.

A Vercel guarda os deploys anteriores, imutáveis. Isso permite trocar a versão no ar sem novo build.

**1. Instant Rollback (painel), o mais rápido:**
Projeto → **Deployments** → no deploy estável anterior, menu `⋯` → **Instant Rollback** (ou **Promote to Production**). O domínio de produção passa a apontar para aquela versão na hora.

**2. Pela CLI:**

```bash
vercel rollback                    # volta para o deploy de produção anterior
vercel rollback <url-ou-id>        # volta para um deploy específico
vercel promote <url-do-preview>    # promove um preview validado para produção
```

**3. Pelo Git (corrige a origem):**

```bash
git revert <hash-do-commit-com-problema>
git push origin main               # gera um novo deploy de produção sem o problema
```

**Fluxo de publicação usado:** a mudança entra por Pull Request → o CI (testes + Lighthouse) roda → a Vercel gera
um Preview Deploy → o merge na `main` publica em produção → o workflow Produção verifica o site publicado. Se algo
escapar, a opção 1 tira a versão do ar e a opção 3 corrige o histórico.

**Regra de proteção da branch `main` (configurado no GitHub).** O que ela faz e o que ela **não** faz:

| A regra exige ou bloqueia | A regra não cobre |
| --- | --- |
| Mudanças entram por Pull Request (não há push direto) | **Revisão humana:** o número de aprovações exigidas é 0, então quem abre o PR pode fazer o merge |
| Os checks "Lint, tipos, testes e build" e "Lighthouse (a11y ≥ 90, performance ≥ 80)" passam antes do merge | **Administradores:** a opção "Do not allow bypassing" está desligada; o dono do repositório pode ignorar a regra |
| A branch do PR está atualizada com a `main` | **Verificação do Preview:** não há check que dependa do Preview Deploy; a revisão visual dele é manual |
| Conversas do PR resolvidas | **Publicação na Vercel:** a Vercel publica qualquer commit que chegue à `main`, sem consultar o CI |
| Force-push e exclusão da `main` bloqueados | **Produção:** o workflow Produção roda depois da publicação; ele avisa, mas não reverte |

As mudanças desta revisão entraram pelo PR [#2](https://github.com/ffabricioffs/lacrei-desafio/pull/2), com os
checks visíveis na página do PR. Isso é um registro do que aconteceu, não uma garantia técnica.

> Observações: após um Instant Rollback, o Vercel desliga a atribuição automática do domínio de produção. Assim, o próximo push na `main` não substitui a versão restaurada sem querer. Para voltar ao fluxo normal, use **Undo Rollback** no painel ou promova um deploy (`vercel promote`). No plano Hobby, o rollback fica limitado ao deploy de produção imediatamente anterior.

## Justificativas visuais e técnicas

### Visual (conferido no Figma do Marsha Design System)

Os tokens e componentes foram extraídos do **Guia de Estilo – Marsha P. Johnson** no Figma, pelo conector oficial do Figma (variáveis, especificações de handoff e assets) e por inspeção das páginas do guia.

| Item | O que o guia define | Onde está no código |
| --- | --- | --- |
| Cores | Emerald 10–80 (primária `#018762`, hover `#007756`, pressionado `#014C37`), cinzas (título `#131313`, corpo `#2D2D2D`, apoio `#515151`, bordas `#BFBFBF`/`#CFCFCF`), red-60 para erro, blue-60 `#28588A` para foco e gradiente `gradient-subtle` | `src/styles/theme.ts`, com o nome do token do Figma ao lado de cada valor |
| Tipografia | Nunito. Headline-xl 48 · lg 40 · base 32 · sm 24 (Bold, 120%) e Text-xl 18 · base 16 · sm 14 · xs 12 (150%) | `fontSizes` no tema. O `h1` usa Headline-xl, os títulos de seção Headline-lg e o corpo Text-base/Text-xl |
| Espaços | Sistema em múltiplos de 8px | `space` no tema (8, 16, 24, 32, 48, 64, 80) |
| Pontos de quebra | Mobile < 600 · tablet 600–1023 · desktop ≥ 1024 · grid XL ≥ 1200. Conteúdo de 1116px no desktop | `breakpoints` e `layout.maxWidth` |
| Botões | 48px de altura, padding horizontal 32, raio 8, Bold 18, sombra `0 5px 5px rgba(0,0,0,.3)`. Estados de hover, pressionado e desabilitado em Solid, Outline e Link (o texto do hover foi escurecido, ver "Limitações"). Foco com anel de 2px blue-60 a 4px do botão | `components/Button`, `styles/interactionStates.ts` |
| Header | "Header Institucional": fundo `gradient-subtle`, 96px de altura, logo oficial, links no estilo Button Link e botão Solid. No mobile, botão de ícone Solid de 48px | `components/Header` |
| Footer | "Footer Institucional": divisórias em emerald-20, logo empilhado, redes sociais (botões Ghost 48px), três colunas de links (título 18 Bold, links 16 com 48px de altura mínima), avisos em 14px e botão Outline "voltar ao topo". No mobile, as colunas ficam em grade, sem o logo | `components/Footer` |
| Accordion, Input e Tag | Conferidos nas páginas de handoff (detalhes em "Limitações e observações") | `components/Accordion`, `ProfessionalSearch`, `ProfessionalCard` |
| Logo e ícones | Logo horizontal, logo empilhado e ícones (Facebook, Instagram, LinkedIn, e-mail, seta) exportados do Figma **sem alteração**: os arquivos têm o mesmo hash SHA-256 dos originais | `public/brand`, `public/icons` |

**Conferência medida:** o script de evidências lê os estilos computados no Chrome e compara 43 itens com os
valores do Figma (cores, tipografia, alturas, bordas, foco, logos). Resultado do commit `746117b`: 43 de 43, com
capturas dos componentes ao lado ([`marsha.md`](docs/evidencias/746117b/marsha.md)). Três itens diferem do Figma de propósito, por
contraste, e estão marcados na tabela.

Outras decisões:

- **Títulos em `#131313`** (Text/heading), como nos exemplos de aplicação do guia. O verde fica para ações, links e destaques.
- **Ilustrações próprias em SVG** só com cores da paleta e a bandeira do orgulho, leves e nítidas em qualquer tela.
- **Conteúdo com o tom da Lacrei:** pronomes visíveis em cada perfil, recursos de acessibilidade do atendimento, aviso de que a plataforma não atende emergências e contato do CVV (188) no rodapé.
- **Mobile-first:** os estilos partem da tela pequena, e as media queries só adicionam colunas e espaçamento nos pontos de quebra do guia.

### Técnico

- **Next.js 16 (App Router)** com páginas pré-renderizadas e Route Handler para a API simulada.
- **Styled-Components 6** com o plugin SWC (`compiler.styledComponents`) e o *registry* recomendado pela documentação do Next para SSR. O CSS chega no HTML inicial, sem flash de conteúdo sem estilo. Props de estilo usam o prefixo `$` (*transient props*) para não vazar para o DOM.
- **TypeScript estrito**, com o tema tipado (`DefaultTheme`): erro de token vira erro de compilação.
- **`ButtonLink`** escolhe sozinho entre `next/link` (rota interna), `<a>` (âncora) e `<a target="_blank" rel="noopener noreferrer">` (externo), para ninguém esquecer o `rel` ou o aviso de nova aba.
- **Rádios nativos estilizados** em vez de botões com `aria-pressed`: semântica e navegação por setas vêm de graça.
- **Cabeçalhos de segurança** em `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) e `poweredByHeader: false`.

### Limitações e observações

- **Como os componentes foram conferidos:** cores, tipografia, botões, header, footer, logo e ícones vieram do conector oficial do Figma, com valores exatos. Acordeão, campo de texto e Tags foram conferidos pelas páginas de handoff do guia:
  - **Accordion:** título em 16px Bold, divisória `#CFCFCF` entre título e conteúdo, ícone em `#131313` e foco na borda do item.
  - **Input:** label em negrito, borda de 2px e raio 8; no hover e quando preenchido, a borda fica `#29A480`.
  - **Tag:** cantos suaves, fundo `#DFF2ED`/`#F0F0F0` e texto escuro.

  O Marsha não tem um componente de "chip" de filtro, então os filtros de modalidade combinam o Radio nativo (pela acessibilidade) com o visual dos botões Outline/Solid.
- **Contraste do hover, corrigido:** no guia, o texto `#007756` sobre `#B2DFD0` (hover do Outline e do Button Link) tem 3,81:1, abaixo dos 4,5:1 do AA para texto de 18px Bold. O site mantém o fundo do guia e usa `#014C37` (emerald-80, o tom do estado pressionado), com 6,87:1. No header, o link em repouso usa `#007756` (5,45:1), porque `#018762` sobre o degradê do header ficaria em 4,43:1. Vale levar esse ajuste ao time do Marsha.
- **Rodapé sem CNPJ:** o "Footer Institucional" traz o CNPJ da Lacrei. Como este site é um projeto de desafio, e não o site oficial, troquei essa linha por um aviso de que é um projeto do desafio.

## Checklist dos critérios de aceite

| Item | Status | Onde |
| --- | --- | --- |
| Duas páginas com roteamento funcional | ✅ | `/` e `/profissionais` (+ 404) |
| Header e Footer personalizados | ✅ | `components/Header`, `components/Footer` |
| Três botões interativos | ✅ | Sete tipos de ação real (ver [tabela](#fluxo-navegável-e-botões-interativos)) |
| Responsividade mobile-first | ✅ | Breakpoints em `styles/theme.ts`; capturas e medições em 6 larguras: [evidências](docs/evidencias/746117b/README.md#3-responsividade-) |
| Acessibilidade ≥ 90 no Lighthouse | ✅ medido | 100 nas duas páginas, mobile e desktop ([relatórios](docs/evidencias/746117b/README.md#2-lighthouse-duas-páginas-mobile-e-desktop)) |
| Teste com leitor de tela | ✅ | NVDA + Edge, ver [registro](#teste-com-leitor-de-tela) |
| Performance ≥ 80 no Lighthouse | ✅ medido | 97–100 no build local ([relatórios](docs/evidencias/746117b/README.md#2-lighthouse-duas-páginas-mobile-e-desktop)); na Vercel, ver workflow Produção |
| Next.js + TypeScript + Styled-Components | ✅ | |
| Testes unitários (mín. 3 componentes) | ✅ medido | 5 componentes + lógica da API + contraste, 71 testes ([saída](docs/evidencias/746117b/testes/jest-saida.txt)) |
| Deploy funcional | ✅ | https://lacrei-desafio-mu.vercel.app · commit no rodapé e em `/api/versao` · verificado pelo workflow Produção |
| README completo + rollback | ✅ | Este arquivo (rollback documentado, não executado) |
| Mock de integração com API (opcional) | ✅ | `/api/profissionais` |
