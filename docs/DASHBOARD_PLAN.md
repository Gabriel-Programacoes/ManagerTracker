# 📋 Dashboard — Plano de Desenvolvimento

> **ManagerTracker · Tactical Noir** — EA FC Career Tracker  
> Stack: Next.js 16 · React 19 · Tailwind CSS v4 · Radix UI Themes · Framer Motion

---

## Por que começar pelo Dashboard?

**Sim, é a abordagem certa.** O Dashboard é a página-âncora do projeto por três razões:

1. **Define a linguagem visual** — As decisões de tipografia, espaçamento, cores e motion aqui se propagam para todas as outras páginas. Errar aqui cedo é barato; refatorar depois de 5 páginas prontas é caro.
2. **Valida a arquitetura de componentes** — Qualquer componente reutilizável (`StatCard`, `FormBadge`, `SectionHeader`) nasce aqui e será reutilizado em Squad, Matches e Transfers.
3. **É o "cartão de visita"** — É o que o usuário vê primeiro. Se o dashboard impressiona, o resto da aplicação já tem uma baseline alta.

---

## Diagnóstico do Estado Atual

| Área | Problema |
|------|----------|
| **Header** | Texto grande mas sem hierarquia visual clara; ticker de stats parece colado |
| **KPI Cards** | Cards vazios demais — só texto, sem nenhuma diferenciação visual por tipo de dado |
| **Dados** | 4 métricas isoladas sem relação entre si — não conta uma história |
| **Composição** | Grid 4-colunas uniforme; tudo tem o mesmo peso visual |
| **Motion** | `ChalkboardRevealCard` tem uma ideia boa mas está subutilizado |
| **Sidebar** | Funcional mas sem personalidade; parece um nav genérico |

---

## Visão do Dashboard Revisado

### Layout Geral (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR (w-64)   │         MAIN CONTENT                │
│                   │                                     │
│  ManagerTracker   │  [HERO HEADER — Manager Identity]   │
│  Tactical Noir    │  ─────────────────────────────────  │
│                   │  [KPI ROW — 4 cards grandes]        │
│  ○ Dashboard      │  ─────────────────────────────────  │
│  · Squad          │  [COLUNA ESQUERDA] [COLUNA DIREITA] │
│  · Matches        │  Season Stats     Upcoming Fixtures │
│  · Transfers      │  ─────────────────────────────────  │
│  · Youth Academy  │  [COLUNA ESQUERDA] [COLUNA DIREITA] │
│                   │  Top Performers   Squad Health      │
│  ──────────────── │                                     │
│  [Season Badge]   │                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Seções a Construir (por Fase)

---

### FASE 1 — Fundação Visual (crítico, fazer primeiro)

#### 1.1 · Melhorar o `globals.css`
- Adicionar variáveis CSS para os tokens de design (spacing, cores semânticas)
- Criar utilitários: `.stat-label`, `.section-title`, `.divider-tactical`
- Adicionar `@keyframes` para animação de ticker e scanline sutil no fundo

**Exemplo de tokens:**
```css
:root {
  --accent: #d9f99d;       /* lime-200 */
  --accent-dim: #4d7c0f;   /* lime-700 */
  --panel-border: #3f3f46; /* zinc-700 */
  --panel-bg: #0a0a0a;
  --muted: #a3a3a3;
}
```

#### 1.2 · Nova Sidebar (`app-shell.tsx`)
- Adicionar logo/ícone do clube acima do nome do manager
- Indicador de "posição na liga" na sidebar (ex: `#2 · Premier League`)
- Separadores visuais entre grupos de nav
- Rodapé da sidebar com Season atual + badge animado
- Hover states mais ricos nos itens de nav

---

### FASE 2 — Hero Header

**Objetivo:** Transformar o header em uma peça de identidade forte.

#### Componente: `<DashboardHero>`

**Estrutura:**
```
┌──────────────────────────────────────────────────────┐
│ [CLUBE BADGE placeholder] │ MGR // GABRIEL            │
│                           │ Arsenal FC · Season 26/27  │
│                           │ #2 na Liga                │
├──────────────────────────────────────────────────────┤
│ ← Ticker animado: WIN RATE • TROPHIES • BUDGET →     │
└──────────────────────────────────────────────────────┘
```

**Melhorias:**
- Ticker com animação CSS `scroll` infinito (não JS)
- Nome do manager em Teko bold, tamanho maior
- Linha de "subtítulo" com clube + temporada em JetBrains Mono
- Badge de posição na liga com cor semântica (verde se top 4, amarelo se 5–10, etc.)
- Animação de entrada com `framer-motion` staggered

---

### FASE 3 — KPI Cards

**Objetivo:** Cada card deve ter identidade única e comunicar o dado de forma visual.

#### Componente: `<KpiCard>` (substitui o `ChalkboardRevealCard` nos stats)

4 cards em grid, cada um com tipologia diferente:

| Card | Visual | Dado Extra |
|------|--------|-----------|
| **Próximo Jogo** | Badge de competição colorido + ícone H/A | Data formatada relativa ("Em 7 dias") |
| **Forma Recente** | Blocos W/D/L com tamanhos variados (último jogo maior) | Mini-label "Últimas 5" |
| **Artilheiro** | Nome + mini barra de progresso de gols | Goals / Assists side-by-side |
| **Budget** | Número grande + barra visual de orçamento restante | Comparação com temporada anterior |

**Hover:** Manter o efeito `ChalkboardRevealCard` existente — está bom, só precisa de conteúdo melhor.

---

### FASE 4 — Season Stats Section

**Objetivo:** Seção de duas colunas com dados mais ricos.

#### Componente: `<SeasonSnapshot>`

```
Vitórias  Empates  Derrotas   |  Gols Marcados / Sofridos
   19        4        6       |  ████████████░░  47 GM
[██████████████░░░░░░░░░░]    |  ████░░░░░░░░░░  21 GS
       65.5% Win Rate         |  Saldo: +26
```

- Barras de progresso usando `@radix-ui/react-progress` (já instalado!)
- Números animados na entrada (Framer Motion `useAnimate` ou counter)
- Labels precisos com `[font-variant-numeric: tabular-nums]`

---

### FASE 5 — Próximos Jogos

#### Componente: `<UpcomingFixtures>`

Lista vertical dos próximos 2–3 jogos com:
- Data relativa ("Dom · Mar 22")
- Badge de competição (Liga / Copa / Continental) com cores distintas
- H/A indicator
- Adversário em destaque

---

### FASE 6 — Top Performers Mini-Table

#### Componente: `<TopPerformers>`

Table minimalista com os top 3 jogadores:
- Position badge colorido (GK, DF, MF, FW)
- Nome
- Goals + Assists
- Overall rating com cor semântica (verde > 85, amarelo 80–84, cinza < 80)

---

### FASE 7 — Squad Health

#### Componente: `<SquadHealth>`

- Lista de jogadores com status não "Fit"
- Se ninguém lesionado: mensagem "Squad at full strength" com ícone
- Para lesionados: nome + posição + badge "Injured"/"Suspended" colorido

---

## Arquivo de Componentes a Criar

```
components/
  dashboard/
    dashboard-hero.tsx        ← Fase 2
    kpi-card.tsx              ← Fase 3
    season-snapshot.tsx       ← Fase 4
    upcoming-fixtures.tsx     ← Fase 5
    top-performers.tsx        ← Fase 6
    squad-health.tsx          ← Fase 7
  ui/
    stat-bar.tsx              ← Barra de progresso semântica
    competition-badge.tsx     ← Badge colorido por competição
    form-strip.tsx            ← W/D/L blocks (extrair do card atual)
```

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| **Animações números** | Framer Motion `useAnimate` | Já instalado, consistência |
| **Progress bars** | `@radix-ui/react-progress` | Já instalado, acessível |
| **Ticker scroll** | CSS `animation: scroll` | Zero JS, melhor performance |
| **Componentes** | Server Components por padrão | Dados são mock-data (sem interatividade necessária) |
| **Client boundary** | Só onde há motion/state | Manter bundle pequeno |

---

## Ordem de Execução Recomendada

```
[1] globals.css tokens + utilitários
[2] Sidebar melhorada (app-shell.tsx)
[3] DashboardHero
[4] KpiCard (refactor dos 4 cards existentes)
[5] SeasonSnapshot
[6] UpcomingFixtures + TopPerformers + SquadHealth
[7] Ajustes finais, polish de motion, responsivo
```

**Estimativa:** 7 etapas bem definidas. Nenhuma bloqueia a outra após a etapa [1].

---

## Critério de "Dashboard Pronto"

- [ ] O usuário entende a situação da carreira em menos de 5 segundos
- [ ] Cada seção tem hierarquia visual clara (título → dado principal → detalhe)
- [ ] Funciona bem em mobile (sidebar vira menu horizontal)  
- [ ] Animações não causam layout shift
- [ ] Zero `any` no TypeScript
- [ ] Todos os dados vêm de `mock-data.ts` (pronto para futura API)

