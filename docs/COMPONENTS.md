# 🧩 Componentes

Catálogo de todos os componentes da aplicação com props, responsabilidades e dependências.

---

## `components/app-shell.tsx`

Layout wrapper principal. Envolve todas as páginas com a sidebar de navegação.

```typescript
<AppShell>{children}</AppShell>
```

| Prop | Tipo | Descrição |
|---|---|---|
| `children` | `ReactNode` | Conteúdo da página |

---

## components/squad/

### `SquadTable`

Tabela principal do elenco. Gerencia o estado de seleção e renderiza o `PlayerDetailModal`.

```typescript
<SquadTable players={SquadPlayer[]} />
```

**Comportamentos:**
- Mantém `selected: SquadPlayer | null` em estado local
- Sincroniza `selected` automaticamente quando o prop `players` é atualizado (após saves via `revalidatePath`)
- Exibe clean sheets apenas para posições defensivas (`GOL`, `ZAG`, `LAT`)

---

### `PlayerDetailModal`

Modal de detalhes completo de um jogador. Possui **três seções editáveis independentes**.

```typescript
<PlayerDetailModal
  player={SquadPlayer | null}
  onClose={() => void}
/>
```

**Seções e estados de edição:**

| Seção | Estado | Action chamada |
|---|---|---|
| Atributos + Radar | somente leitura | — |
| Temporada | `editingStats` | `updatePlayerStats()` |
| Contrato & Finanças | `editing` | `updatePlayerContract()` |
| Prêmios | `editingAwards` | `updatePlayerContract()` |

**Lógica de radar:**
- Jogadores de linha: hexágono com VEL, FIN, DRI, FIS, DEF, PAS
- Goleiros (`GOL`): pentágono com DIV, REF, HAN, KIC, POS

**Sync de dados:**
- `useEffect` depende do objeto `player` completo (não só do ID), garantindo re-sincronização quando os dados são atualizados pelo servidor

---

### `SquadActions`

Barra de ações da página `/squad`. Contém o botão de abrir o `AddPlayerModal` e o `ManualPlayerForm`.

```typescript
<SquadActions />  // sem props — autônomo
```

---

### `AddPlayerModal`

Modal de busca e adição de jogadores da base FIFA.

```typescript
<AddPlayerModal onClose={() => void} />
```

**Funcionalidades:**
- Busca com debounce por nome
- Paginação (50 por página)
- Exibe: nome, posição (traduzida para PT-BR), OVR, atributos PAC/SHO/PAS/DRI/DEF/PHY
- Chama `addPlayerToSquad()` ao confirmar

---

### `ManualPlayerForm`

Formulário inline e rápido para criar um jogador sem atributos detalhados.

```typescript
<ManualPlayerForm />  // sem props — autônomo
```

- Aparece colapsado; expande ao clicar
- Campos: Nome, Posição (`CustomSelect`), OVR, Valor de Mercado, Salário, Contrato
- Usa `addCustomPlayerToSquad()`

---

### `CreatePlayerForm`

Formulário completo para criar um jogador detalhado. Usado na página `/squad/new`.

```typescript
<CreatePlayerForm />  // sem props — autônomo
```

**Campos de identidade:**
- Nome, Posição (`CustomSelect`), Overall (manual, 1–99), Idade, Altura, Pé Preferido, Skill Moves★, Perna Ruim★

**Atributos (dinâmicos por posição):**
- Jogador de linha: Velocidade, Finalização, Passe, Drible, Defesa, Físico (sliders)
- Goleiro: GK Diving, GK Handling, GK Kicking, GK Positioning, GK Reflexes (sliders)

**Prévia ao vivo:**
- Card lateral com posição, OVR, metadados e barrinhas de atributos atualizados em tempo real

---

## components/ui/

### `CustomSelect`

Select customizado com dropdown animado. Substitui o `<select>` nativo em todos os formulários.

```typescript
<CustomSelect
  id?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
/>
```

**Comportamentos:**
- Fecha ao clicar fora (listener `mousedown` no documento)
- Fecha ao pressionar `Escape`
- Chevron animado (180° quando aberto) via Framer Motion
- Dropdown com `max-height: 260px` e scroll interno
- Item selecionado destacado com ícone `✓` e cor `var(--accent)`
- Animação de entrada/saída com `AnimatePresence`

---

## components/dashboard/

### `DashboardHero`

Card hero do dashboard com informações do save atual.

```typescript
<DashboardHero />  // dados via mock-data por enquanto
```

---

## Utilitários de Componente (`lib/player-utils.ts`)

Funções e constantes compartilhadas entre componentes:

### `ovrColor(ovr: number): string`
Retorna a cor CSS baseada no overall:
- `>= 90` → `var(--caution)` (dourado — elite)
- `>= 80` → `var(--accent-strong)` (ciano forte)
- `>= 70` → `var(--accent)` (ciano)
- `>= 60` → `var(--muted)` (cinza)
- `< 60` → `var(--muted-dim)` (cinza escuro)

### `statColor(val: number): string`
Retorna a cor CSS para barrinhas de atributo:
- `>= 85` → `var(--caution)`
- `>= 75` → `var(--accent-strong)`
- `>= 65` → `var(--accent)`
- `>= 50` → `var(--muted)`
- `< 50` → `var(--loss)` (vermelho)

### `normalizeFifaPosition(pos: string): string`
Converte posições em inglês do CSV para PT-BR:
```
GK → GOL   CB → ZAG   LB/RB → LD/LE   LWB/RWB → AE/AD
CDM → VOL  CM → MC    CAM → MEI       LM/RM → ME/MD
LW → PTE   RW → PTD   ST/CF → ATA
```

### `POSITIONS`
Array com todas as posições disponíveis para selects:
`GOL, ZAG, LD, LE, AD, AE, LAT, VOL, MC, MD, ME, MEI, PTE, PTD, ATA`

### `POSITION_STYLE`
Record mapeando posição → `{ color, bg }` para o badge colorido.

