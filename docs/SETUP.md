# ⚙️ Setup — Configuração do Ambiente

Guia completo para rodar o ManagerTracker localmente do zero.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| Node.js | 20.x | `node -v` |
| npm | 9.x | `npm -v` |
| Git | qualquer | `git -v` |

---

## 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd ManagerTracker
```

---

## 2. Instalar Dependências

```bash
npm install
```

---

## 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
# .env
DATABASE_URL="file:./prisma/dev.db"
```

> ⚠️ Sem essa variável o Prisma não consegue localizar o banco SQLite e o seed falhará com `PrismaClientInitializationError: Environment variable not found: DATABASE_URL`.

---

## 4. Criar o Banco de Dados

Execute as migrações Prisma para criar todas as tabelas:

```bash
npx prisma migrate dev
```

Isso irá:
1. Criar o arquivo `prisma/dev.db` (SQLite)
2. Aplicar todas as migrações em `prisma/migrations/`
3. Gerar o Prisma Client tipado

> 💡 Para visualizar o banco graficamente: `npx prisma studio`

---

## 5. Popular com Jogadores do EA FC

O arquivo `players.csv` na raiz contém mais de **16.000 jogadores** do EA FC com todos os atributos. Execute o seed:

```bash
npm run seed
```

O script `seed.mjs` irá:
- Ler o CSV (`players.csv`)
- Filtrar duplicatas por ID
- Inserir em lotes de 1.000 registros na tabela `fifa_players`
- Importar campos: OVR, PAC, SHO, PAS, DRI, DEF, PHY, altura, peso, pé preferido, perna ruim, skill moves, atributos GK, posição, nação, liga, time

> ⚠️ Se precisar re-popular (ex: após adicionar campos ao schema), apague os registros antigos antes:
> ```bash
> node clear-fifa.mjs
> npm run seed
> ```

---

## 6. Iniciar o Servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Resetar o Banco Completamente

Para começar do zero (apaga todos os dados, incluindo seu elenco):

```bash
# Apagar o banco
rm prisma/dev.db

# Recriar e migrar
npx prisma migrate dev

# Re-popular jogadores FIFA
npm run seed
```

---

## Troubleshooting

### `EPERM: operation not permitted` ao rodar `prisma generate`

O servidor de desenvolvimento (`npm run dev`) bloqueia a DLL do Prisma no Windows. Pare o servidor, rode `npx prisma generate` e inicie novamente.

### `Error: Cannot find module '@prisma/client'`

```bash
npx prisma generate
```

### Seed falha com erro de banco

Verifique se o `.env` existe e se o banco foi criado com `npx prisma migrate dev` antes de rodar o seed.

