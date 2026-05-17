# ✨ Features

Estado atual de cada funcionalidade e roadmap de desenvolvimento.

---

## ✅ Implementado

### 🏟️ Gestão de Elenco (`/squad`)

#### Tabela do Elenco
- Lista de todos os jogadores do elenco ordenados por OVR
- Colunas: Nome, Posição (badge colorido), OVR, Jogos, Gols, Assistências, Cartões Amarelos, Cartões Vermelhos, Clean Sheets
- Clean Sheets exibido apenas para posições defensivas (GOL, ZAG, LAT)
- Clique em qualquer linha abre o **Modal de Detalhes**

#### Adicionar Jogador da Base FIFA
- Botão "Adicionar Jogador" abre modal de busca
- Busca por nome com paginação (50 por página)
- Exibe atributos (PAC, SHO, PAS, DRI, DEF, PHY) em mini-cards
- Posições exibidas em PT-BR com cores por categoria
- Confirmação com animação de feedback

#### Criar Jogador Manual (Rápido)
- Formulário inline colapsável
- Campos: Nome, Posição, OVR, Valor de Mercado, Salário, Contrato

#### Criar Jogador Detalhado (`/squad/new`)
- Formulário completo com todas as informações
- **Identidade:** Nome, Posição, Overall (manual), Idade, Altura, Pé Preferido, Skill Moves★, Perna Ruim★
- **Atributos dinâmicos:** sliders para outfield (PAC/SHO/PAS/DRI/DEF/PHY) ou GK (Diving/Handling/Kicking/Positioning/Reflexes) com base na posição selecionada
- **Contrato:** Valor de Mercado, Salário, Anos de Contrato
- **Prévia ao vivo** com card, OVR colorido e barrinhas atualizados em tempo real

#### Modal de Detalhes do Jogador
Quatro seções, cada uma com modo de edição independente:

**1. Cabeçalho (somente leitura)**
- Badge de posição colorido
- Nome, Idade, Altura, Pé preferido (traduzido), Skill Moves★, Perna Ruim★
- OVR com cor dinâmica

**2. Atributos + Radar (somente leitura)**
- Barrinhas coloridas por intensidade para cada atributo
- Radar chart hexagonal (outfield) ou pentagonal (goleiro)
- Para jogadores FIFA: atributos buscados da tabela `fifa_players`
- Para jogadores manuais: atributos do próprio `squad_players`

**3. Temporada (editável)**
- Jogos, Gols, Assistências, Cartões Amarelos, Cartões Vermelhos, Clean Sheets
- Botão Editar → inputs numéricos inline → Salvar / Cancelar
- Clean Sheets visível apenas para defensores

**4. Contrato & Finanças (editável)**
- Valor de Mercado, Salário semanal, Anos de Contrato
- Exibição formatada: `€5M`, `€50k / sem`, `2 anos`

**5. Prêmios da Temporada (editável)**
- *Booleanos (liga/desliga):* Bola de Ouro ⭐, Melhor Jogador 🏆, Artilheiro ⚽, Melhor Goleiro 🛡️, Jovem do Ano 📈, Melhor Defensor 💪
- *Contadores (+/-):* Melhor do Mês 🥇, MOTM 🔥 — exibem `N×`

---

## 🚧 Em Desenvolvimento

### 📅 Partidas (`/matches`)
- Rota criada, sem conteúdo
- **Planejado:** registro de partidas, resultado, escalação, estatísticas por jogo

### 🔄 Transferências (`/transfers`)
- Rota criada, sem conteúdo
- **Planejado:** histórico de entradas e saídas, valores pagos/recebidos, saldo da janela

### 🌱 Academia de Jovens (`/youth-academy`)
- Rota criada, sem conteúdo
- **Planejado:** monitoramento de promessas, progressão de potencial, promoções ao time principal

### 🏠 Dashboard (`/`)
- Estrutura criada com `DashboardHero`
- **Planejado:** resumo da temporada, forma recente, destaques do elenco, próxima partida

---

## 💡 Roadmap Futuro

| Feature | Descrição |
|---|---|
| **Reset de Temporada** | Zerar estatísticas de todos os jogadores para nova temporada mantendo contratos |
| **Histórico de Temporadas** | Arquivar stats e prêmios por temporada |
| **Comparação de Jogadores** | Side-by-side de dois jogadores com radar sobrepostos |
| **Exportar Dados** | CSV ou JSON do elenco atual |
| **Filtros na Tabela** | Filtrar por posição, faixa de OVR, contrato expirando |
| **Foto dos Jogadores** | Buscar imagem pelo `fifaPlayerId` de APIs externas |
| **Evolução de Atributos** | Editar OVR e atributos individualmente ao longo do save |
| **Múltiplos Saves** | Gerenciar mais de um save/manager simultaneamente |

