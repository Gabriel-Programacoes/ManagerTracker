# ⚽ ManagerTracker

> Seu diário de manager. Registre, analise e domine cada temporada.

ManagerTracker é uma aplicação web para acompanhar saves de modo carreira de jogos de futebol (EA FC / FIFA). Registre estatísticas de jogadores, prêmios, contratos, progressão de atributos e muito mais — tudo com uma interface temática **Tactical Noir**.

---

## ✨ Funcionalidades

- 🔍 **Busca de jogadores** do jogo base (16.000+ jogadores do CSV do EA FC)
- 🏟️ **Gestão de elenco** — adicionar, criar e detalhar jogadores
- 📊 **Estatísticas da temporada** — jogos, gols, assistências, cartões, clean sheets
- 🎯 **Atributos detalhados** — barras e radar chart (outfield + goleiro)
- 🏆 **Prêmios individuais** — Bola de Ouro, Melhor Jogador, MOTM, Melhor do Mês e mais
- 💰 **Contrato & Finanças** — valor de mercado, salário, anos de contrato
- ⚽ **Suporte a Goleiros** — atributos GK dedicados (Diving, Handling, Kicking, Positioning, Reflexes)
- 🌍 **Posições em PT-BR** — mapeamento automático das posições EN do CSV

---

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
# Edite .env com: DATABASE_URL="file:./prisma/dev.db"

# 3. Criar banco e aplicar migrações
npx prisma migrate dev

# 4. Popular com jogadores do EA FC
npm run seed

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> 📋 Para instruções detalhadas, veja [docs/SETUP.md](docs/SETUP.md)

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16.2.6 |
| Linguagem | TypeScript | ^5 |
| Banco de Dados | SQLite via [Prisma](https://prisma.io/) | 6.19.3 |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) | v4 |
| Componentes UI | [Radix UI Themes](https://www.radix-ui.com/) | ^3 |
| Animações | [Framer Motion](https://www.framer.com/motion/) | ^12 |
| Ícones | [Lucide React](https://lucide.dev/) | ^1 |
| Runtime | Node.js | ≥ 20 |

---

## 📁 Estrutura do Projeto

```
ManagerTracker/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Dashboard
│   ├── squad/              # Gestão de elenco
│   ├── matches/            # Partidas
│   ├── transfers/          # Transferências
│   ├── youth-academy/      # Academia de jovens
│   └── actions/            # Server Actions (Prisma)
├── components/
│   ├── squad/              # Componentes de elenco
│   ├── dashboard/          # Componentes do dashboard
│   └── ui/                 # Componentes genéricos reutilizáveis
├── lib/
│   ├── player-utils.ts     # Tipos, utilitários e constantes de jogador
│   ├── prisma.ts           # Cliente Prisma singleton
│   └── types.ts            # Tipos de domínio gerais
├── prisma/
│   ├── schema.prisma       # Schema do banco
│   └── dev.db              # Banco SQLite local
├── seed.mjs                # Script de importação do CSV
└── players.csv             # Base de jogadores do EA FC
```

> 📐 Para detalhes de arquitetura, veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 📚 Documentação

| Documento | Descrição |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | Configuração do ambiente local |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura, fluxo de dados e decisões técnicas |
| [docs/DATABASE.md](docs/DATABASE.md) | Schema do banco, modelos e relacionamentos |
| [docs/FEATURES.md](docs/FEATURES.md) | Funcionalidades por página e roadmap |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Catálogo de componentes |
| [docs/ACTIONS.md](docs/ACTIONS.md) | Referência das Server Actions |

---

## 📜 Scripts

```bash
npm run dev      # Servidor de desenvolvimento (Turbopack)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
npm run seed     # Popular banco com jogadores do CSV
```

