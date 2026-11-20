# Lacrei Saúde · Desafio Técnico Front-end

Duas páginas interativas, acessíveis e responsivas que seguem a identidade visual da Lacrei Saúde (Marsha Design System), construídas com **Next.js 16 + TypeScript + Styled-Components**.

- **Deploy:** https://lacrei-desafio-mu.vercel.app
- **Repositório:** https://github.com/ffabricioffs/lacrei-desafio

| Página | Rota | O que faz |
| --- | --- | --- |
| Início | `/` | Apresentação, "como funciona", público-alvo e perguntas frequentes (acordeão) |
| Buscar profissionais | `/profissionais` | Busca com filtros consumindo uma **API simulada** (`/api/profissionais`) |
| 404 | qualquer outra | Página de erro com caminho de volta ao início |

<p>
  <img src="docs/screenshots/mobile-home.png" alt="Página inicial no celular" width="220" />
  <img src="docs/screenshots/desktop-profissionais.png" alt="Busca de profissionais no desktop" width="560" />
</p>

---

## Sumário

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

---

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

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx              # HTML base (lang pt-BR), fonte, Header, <main>, Footer
│   ├── page.tsx                # Página inicial
│   ├── profissionais/page.tsx  # Página de busca
│   ├── api/profissionais/      # Route Handler: API simulada
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
├── lib/                        # Registry do styled-components e lógica de filtro
├── services/professionals.ts   # Cliente HTTP da API
├── styles/                     # Tema (tokens Marsha) e estilos globais
└── types/
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

**Resultado no Lighthouse: 100/100 nas duas páginas** (mobile e desktop). O mínimo exigido é 90.

O que foi aplicado:

- **HTML semântico:** `header`, `nav` (com rótulos distintos), `main`, `section` com `aria-labelledby`, `article` para cada profissional, `footer`, listas reais (`ul`/`ol`), um único `h1` por página e hierarquia de títulos sem saltos.
- **Teclado:** link "Pular para o conteúdo principal" como primeiro item focável; foco sempre visível (contorno de 3px); ordem de tabulação seguindo a ordem visual; Esc fecha o menu.
- **ARIA só onde o HTML não basta:** `aria-expanded`/`aria-controls` (menu, acordeão, detalhes do card), `aria-current="page"` (link ativo), `role="status"` + `aria-live="polite"` (total de resultados), `role="alert"` (erro), `role="search"` (formulário de busca).
- **Leitores de tela:** links externos avisam "(abre em nova aba)"; botões "Ver detalhes" incluem o nome da pessoa em texto oculto ("Ver detalhes de Dra. Helena Duarte"); ilustrações decorativas com `alt=""`.
- **Formulário:** `label` associado a cada campo, dica ligada por `aria-describedby`, rádios nativos agrupados em `fieldset`/`legend`.
- **Contraste (WCAG AA):** verde `#018762` sobre branco = 4,53:1; texto `#1F1F1F` = 16,6:1; texto secundário `#515151` = 8:1. O verde só é usado como cor de texto sobre fundo branco.
- **Alvos de toque:** botões com no mínimo 44–48px de altura.
- **Movimento reduzido:** animações e rolagem suave desligadas com `prefers-reduced-motion: reduce`.
- **Testes automatizados com `jest-axe`** em todos os componentes testados (zero violações).

### Teste com leitor de tela

> ⚠️ **Preencha esta seção depois de testar.** Os testes automatizados (axe e Lighthouse) não substituem um teste manual. Roteiro sugerido com NVDA (Windows, Chrome/Firefox) ou VoiceOver (macOS, Safari: `Cmd + F5`):

| Verificação | Esperado | Resultado |
| --- | --- | --- |
| `Tab` na página inicial | Primeiro foco: "Pular para o conteúdo principal" | ☐ |
| Navegar por marcos (NVDA `D` / VoiceOver rotor) | Banner (header), Navegação principal, Principal (main), Rodapé (contentinfo) e as navegações do rodapé | ☐ |
| Navegar por títulos (NVDA `H`) | Um `h1` e seções em `h2` | ☐ |
| Botão do menu (mobile) | Anuncia "Abrir menu, botão, recolhido" e depois "expandido" | ☐ |
| Pergunta frequente | Anuncia "botão, recolhido/expandido" | ☐ |
| Filtro "Online" | Anuncia rádio e, ao trocar, o novo total de resultados | ☐ |
| "Ver detalhes" | Anuncia o nome da pessoa e o estado expandido | ☐ |
| Link externo | Anuncia "(abre em nova aba)" | ☐ |

## Performance

**Resultado no Lighthouse: 97 a 100** (mínimo exigido: 80).

| Página | Mobile | Desktop | LCP (mobile) | CLS |
| --- | --- | --- | --- | --- |
| `/` | 97–100 | 100 | 1,4–2,5 s | 0 |
| `/profissionais` | 99–100 | 100 | 0,8 s | 0 |

_Medido com Lighthouse 13 (várias execuções) sobre o build de produção local. No Vercel os números tendem a ser iguais ou melhores (CDN + HTTP/2)._

- **Páginas pré-renderizadas** (estáticas) no build. Só a API roda sob demanda.
- **Imagens:** `next/image` com `width`/`height` (sem layout shift); a ilustração abaixo da dobra usa `loading="lazy"`; a do hero usa `loading="eager"` + `fetchPriority="high"` por ser candidata a LCP. As ilustrações são SVGs leves (menos de 2 KB cada).
- **Fonte auto-hospedada** com `next/font/local` (Nunito 400/600/700/800 em `.woff2`, só subset latino), com `display: swap` e preload automático. Nenhuma requisição a servidores de terceiros.
- **Bundle enxuto:** sem bibliotecas de UI, ícones ou utilitários extras. Ícones são SVG inline. O plugin SWC do styled-components minifica o CSS e remove espaços em branco.
- **Requisições canceláveis:** a busca usa `AbortController`, então filtros trocados rapidamente não disputam a resposta.
- **Cache HTTP** na API simulada (`max-age=60, stale-while-revalidate=300`).

## Testes (registro)

Jest 30 + React Testing Library + `@testing-library/user-event` + `jest-axe`. **36 testes em 6 suítes, todos passando.**

```bash
npm test               # roda tudo
npm run test:coverage  # com cobertura
```

| Suíte | Componente | O que é verificado |
| --- | --- | --- |
| `Button.test.tsx` | **Navegação (botões/links)** | `type="button"` por padrão, clique + Enter + Espaço, estado desabilitado, props de estilo não vazam para o DOM, `href` interno, link externo com `target`/`rel` seguro e aviso para leitor de tela, axe |
| `Header.test.tsx` | **Header** | Landmark `banner`, logo leva ao início, todos os links da navegação, `aria-current` na página atual, menu mobile com `aria-expanded`/`aria-controls`/rótulo dinâmico, Esc fecha e devolve o foco, axe |
| `Footer.test.tsx` | **Footer** | Landmark `contentinfo`, navegações rotuladas por coluna, links externos seguros, rotas internas, aviso de emergência e CVV 188, axe |
| `Accordion.test.tsx` | **Conteúdo interativo** | Começa fechado, abre/fecha com ligação botão ↔ região, vários abertos, uso só por teclado, nível de título configurável, axe |
| `ProfessionalSearch.test.tsx` | **Conteúdo interativo + API** | Carregamento e total anunciado, busca sem acento, filtro por modalidade, estado vazio + limpar filtros (foco volta ao campo), erro com `role="alert"` + tentar novamente, expandir detalhes do card, axe |
| `professionals.test.ts` | Lógica da API | Normalização de acentos, filtros por termo, especialidade e modalidade, lista de especialidades |

Cobertura dos componentes testados: Accordion, Footer, ProfessionalCard e a lógica de filtro em 100%; Header, Button e ProfessionalSearch acima de 96% das linhas.

**Integração contínua** (`.github/workflows/ci.yml`): a cada push/PR roda lint, tipos, testes com cobertura e build. Em seguida, um job de **Lighthouse CI** (`lighthouserc.json`) falha o pipeline se acessibilidade ficar abaixo de 90 ou performance abaixo de 80 em qualquer uma das duas páginas.

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

**Deploy pela CLI:**

```bash
npm i -g vercel
vercel            # primeiro deploy (preview) e vínculo do projeto
vercel --prod     # promove para produção
```

## Rollback

O Vercel guarda todos os deploys anteriores, imutáveis. Isso permite voltar atrás em segundos, sem rebuild.

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

**Fluxo seguro proposto (Preview Deploy):** toda mudança entra por Pull Request → o CI (testes + Lighthouse) precisa passar → o Vercel gera um Preview Deploy para revisão visual e de acessibilidade → só então o merge na `main` publica em produção. Se algo escapar, usa-se o **Instant Rollback** (opção 1) para estancar na hora e o `git revert` (opção 3) para corrigir o histórico.

> Observações: após um Instant Rollback, o Vercel desliga a atribuição automática do domínio de produção. Assim, o próximo push na `main` não substitui a versão restaurada sem querer. Para voltar ao fluxo normal, use **Undo Rollback** no painel ou promova um deploy (`vercel promote`). No plano Hobby, o rollback fica limitado ao deploy de produção imediatamente anterior.

## Justificativas visuais e técnicas

### Visual

- **Tokens da Marsha centralizados em `src/styles/theme.ts`:** verde primário `#018762`, texto `#1F1F1F`/`#515151`, verde claro `#B0E0D3`, lavanda `#F9F3FF`, raio de 8px e tipografia **Nunito**. Os valores foram conferidos no site oficial da Lacrei. Se algum token do Figma divergir, basta ajustar esse arquivo.
- **Botões** no padrão da Lacrei: Nunito 700, raio 8px, primário cheio e secundário com contorno. Cada um tem estados de hover, active, foco e desabilitado.
- **Hierarquia clara:** títulos principais em verde (só sobre fundo branco, para manter o contraste); títulos de seção em texto escuro; fundos lavanda/verde-claro alternam as seções.
- **Ilustrações próprias em SVG** com as cores da marca e a bandeira do orgulho, leves e nítidas em qualquer tela.
- **Conteúdo com o tom da Lacrei:** pronomes visíveis em cada perfil, recursos de acessibilidade do atendimento, aviso de que a plataforma não atende emergências e contato do CVV (188) no rodapé.
- **Mobile-first:** todos os estilos partem da tela pequena, e as media queries (`576/768/1024/1280px`) só adicionam colunas e espaçamento.

### Técnico

- **Next.js 16 (App Router)** com páginas pré-renderizadas e Route Handler para a API simulada.
- **Styled-Components 6** com o plugin SWC (`compiler.styledComponents`) e o *registry* recomendado pela documentação do Next para SSR. O CSS chega no HTML inicial, sem flash de conteúdo sem estilo. Props de estilo usam o prefixo `$` (*transient props*) para não vazar para o DOM.
- **TypeScript estrito**, com o tema tipado (`DefaultTheme`): erro de token vira erro de compilação.
- **`ButtonLink`** escolhe sozinho entre `next/link` (rota interna), `<a>` (âncora) e `<a target="_blank" rel="noopener noreferrer">` (externo), para ninguém esquecer o `rel` ou o aviso de nova aba.
- **Rádios nativos estilizados** em vez de botões com `aria-pressed`: semântica e navegação por setas vêm de graça.
- **Cabeçalhos de segurança** em `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) e `poweredByHeader: false`.

### Limitações conhecidas

- O Figma da Marsha é protegido por senha. Os tokens foram conferidos no site público da Lacrei. Vale uma última comparação com o guia do Figma.
- O logo é um *wordmark* em texto (Nunito 800). Para usar o logotipo oficial, substitua o conteúdo de `Logo` em `Header.tsx` pelo SVG do Figma, mantendo o `aria-label`.

## Checklist dos critérios de aceite

| Item | Status | Onde |
| --- | --- | --- |
| Duas páginas com roteamento funcional | ✅ | `/` e `/profissionais` (+ 404) |
| Header e Footer personalizados | ✅ | `components/Header`, `components/Footer` |
| Três botões interativos | ✅ | Sete tipos de ação real (ver [tabela](#fluxo-navegável-e-botões-interativos)) |
| Responsividade mobile-first | ✅ | Breakpoints em `styles/theme.ts`, prints em `docs/screenshots` |
| Acessibilidade ≥ 90 no Lighthouse | ✅ | 100 nas duas páginas |
| Performance ≥ 80 no Lighthouse | ✅ | 97–100 |
| Next.js + TypeScript + Styled-Components | ✅ | |
| Testes unitários (mín. 3 componentes) | ✅ | 5 componentes + lógica da API, 36 testes |
| Deploy funcional | ✅ | https://lacrei-desafio-mu.vercel.app |
| README completo + rollback | ✅ | Este arquivo |
| Mock de integração com API (opcional) | ✅ | `/api/profissionais` |
