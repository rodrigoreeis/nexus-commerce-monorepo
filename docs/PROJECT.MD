**# Projeto: Nexus Commerce (Monorepo)**

**Contexto:** Trabalho acadêmico com foco na aplicação prática do Manifesto Ágil (entregas em fatias verticais), arquitetura de software e desenvolvimento acelerado com agentes de IA.

---

## 🎯 Visão Geral do Monorepo

O Nexus Commerce é uma plataforma de e-commerce construída como um **Monorepo Centralizado**, onde todo o ecossistema do projeto (aplicações de frontend, serviços de backend, scripts

de banco de dados, documentação, agentes de IA e skills) reside em um único repositório.

A arquitetura adota uma abordagem **API-First (Monólito Modular no Backend)** com clientes desacoplados no Frontend, estruturada nas pastas principais do repositório:

```text
nexus-commerce-monorepo/
├── apps/
│   ├── backend/                  # Código-fonte da API central em Golang e migrações SQL
│   │   ├── cmd/                  # Servidor HTTP e injeção de dependências
│   │   ├── config/               # Carregamento de configurações e variáveis de ambiente
│   │   ├── migrations/           # Scripts SQL versionados para o PostgreSQL
│   │   ├── postgres/             # Conexão e repositórios de acesso ao banco (database/sql)
│   │   ├── routers/              # Registro e agrupamento de rotas HTTP
│   │   ├── service/              # Camada de serviços de negócio e handlers HTTP
│   │   └── utils/                # Criptografia, hashing e funções auxiliares
│   └── frontend/                 # Aplicações client-side
│       ├── storefront/           # Vitrine pública do consumidor (Next.js 16 + React 19 + TailwindCSS)
│       └── backoffice/           # Painel administrativo do lojista (React 19 + Vite 8 + Chakra UI v3)
├── skills/                   # Manuais técnicos e convenções em formato Antigravity (SKILL.md)
│   ├── backend/              # Skills de Golang, PostgreSQL e Clean Code
│   ├── frontend/             # Skills de Next.js, React, Design System e Acessibilidade
│   ├── best-practices/       # Skills de segurança e código limpo
│   └── conventions/          # Convenções de commits e estrutura
├── .agents/                  # Definição dos Agentes do projeto
│   └── agents/               # Agentes (product-manager, planner, backend-specialist, frontend-specialist)
└── docs/                     # Documentação oficial (PROJECT.MD, ARCHITECTURE.md, ROADMAP.MD)
```
──────

**## 🏗️ Estrutura das Aplicações**

O sistema separa claramente o ecossistema entre apps/backend/ e apps/frontend/:

• apps/backend/ (Nexus API em Go): API central que gerencia todo o domínio do e-commerce e interage com o PostgreSQL via Raw SQL. Possui separação lógica de rotas:

• /api/store/... para consumo da aplicação Storefront.

• /api/admin/... para consumo da aplicação Backoffice.

• apps/frontend/storefront/: Vitrine pública focada na experiência do consumidor final (SSR/SEO) — Next.js 16 + React 19 + TypeScript + TailwindCSS.

• apps/frontend/backoffice/: Painel administrativo para gestão de catálogo, produtos, usuários e pedidos — React 19 + Vite 8 + TypeScript + Chakra UI v3.

**### Setup de Desenvolvimento Local**

• PostgreSQL: sobe via Podman usando compose.yml (podman-compose up -d).

• API Go: roda localmente via make run.

• Convenção global: todos os nomes de tabelas e endpoints estão em inglês.

──────

**## ⚠️ Regras e Restrições Globais (Crucial para Agentes de IA)**

1. Monorepo Unificado: Todas as alterações, novas funcionalidades, migrações e telas devem ser adicionadas dentro das respectivas pastas `apps/backend/` ou `apps/frontend/`.

2. Vertical Slicing: Nenhuma camada (Front, Back ou DB) deve ser desenvolvida isoladamente. Toda funcionalidade deve cruzar as três camadas.

3. Restrição da Release 1: É ESTRITAMENTE PROIBIDO implementar qualquer mecanismo de autenticação (Login/Logout, JWT, Sessions) na primeira entrega.

4. Padrões de Código: Manter a separação clara de responsabilidades lógicas dentro da API (`/api/store` vs `/api/admin`), mesmo compartilhando o mesmo banco de dados.

5. Nomenclatura em Inglês: Todos os nomes de tabelas SQL e endpoints HTTP devem estar em inglês.

6. Skills Obrigatórias: Os agentes de IA devem sempre consultar as skills em `skills/` antes de escrever código.

──────

## 🗺️ Roadmap de Entregas (Releases)

### ⚙️ Release 0: Infraestrutura e Base Técnica do Monorepo

Objetivo Arquitetural: Criar o esqueleto técnico completo de todas as aplicações antes de qualquer desenvolvimento de negócio. Pré-requisito obrigatório para todas as demais releases.

• **Infra**: `compose.yml` com serviço PostgreSQL (compatível com Podman); `Makefile` com targets `run`, `build` e `migrate`.

• **apps/backend/**: Scaffold completo Go — `main.go`, `cmd/api.go`, `config/environments.go`, `config.toml`, `postgres/connection.go`, `postgres/store.go`, `routers/routers.go`, `service/service.go`, `utils/crypto.go`, `migrations/`.

• **apps/frontend/backoffice/**: Scaffold Vite (v8) + React (v19) + TypeScript + Chakra UI v3; estrutura de pastas `src/pages/`, `src/shared/`; tokens de UI; componentes base (`Layout`, `Header`, `Container`); Jest configurado.

• **apps/frontend/storefront/**: Scaffold Next.js (v16) + React (v19) + TypeScript + TailwindCSS; estrutura de pastas `src/app/`, `src/shared/`; tokens de UI; componentes base (`Layout`, `Header`, `Container`); Jest configurado.

### 📦 Release 1: Catálogo Digital Mínimo Viável (MVP)

Objetivo Arquitetural: Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

• **DB**: Criação da tabela `products`; migration SQL versionada: `01-create-products.sql`.

• **API**: Endpoint `POST /api/admin/products` (cadastro de produto) e `GET /api/store/products` (listagem pública de produtos).

• **apps/frontend/backoffice/**: Formulário de cadastro de produto e tela de listagem interna do catálogo.

• **apps/frontend/storefront/**: Vitrine pública com grade de produtos consumindo a API.

### 🛒 Release 2: Jornada de Compra (Carrinho Anônimo)

Objetivo Arquitetural: Introduzir interatividade no client-side e gestão de estado temporário no back-end.

• **DB**: Criação das tabelas `carts` (por Session ID) e `cart_items`; migration SQL versionada: `02-create-carts.sql`.

• **API**: `POST /api/store/cart/items` (adicionar item ao carrinho), `DELETE /api/store/cart/items/:id` (remover item do carrinho), `PATCH /api/store/cart/items/:id` (atualizar quantidade) e `GET /api/store/cart` (obter carrinho com subtotal calculado dinamicamente).

• **apps/frontend/storefront/**: Página de detalhes do produto; interface do carrinho (drawer ou página dedicada) integrada à API.

### 🔐 Release 3: Gestão de Identidade e Controle de Acesso (RBAC)

Objetivo Arquitetural: Implementar autenticação JWT e RBAC no Backoffice para os lojistas. O Storefront permanece anônimo nesta release.

#### Regras de Negócio de Roles

| Role | Criar usuário `user` | Criar usuário `manager` | Criar/promover `admin` | Ver lista de usuários |
|---|---|---|---|---|
| `admin` | ✅ | ✅ | ✅ | ✅ |
| `manager` | ✅ | ❌ | ❌ | ✅ |
| `user` | ❌ | ❌ | ❌ | ❌ |

- O primeiro `admin` (root) é criado **manualmente via banco de dados**.
- **Não há tela de cadastro público** — usuários do Backoffice só são criados internamente por `admin` ou `manager`.
- Usuários do Backoffice são **completamente separados** dos consumidores do Storefront.

#### Entregáveis da Release

• **DB**: Criação da tabela `backoffice_users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`); migration SQL versionada: `03-create-backoffice-users.sql`.

• **API**: `POST /api/admin/auth/login` (autenticação e geração de JWT), `POST /api/admin/users` (criar usuário), `GET /api/admin/users` (listar usuários), `PATCH /api/admin/users/:id/role` (alterar role, restrito a admin), middleware JWT protegendo todas as rotas `/api/admin/*` (exceto login) e bcrypt + JWT em `utils/crypto.go`.

• **apps/frontend/backoffice/**: Tela de Login; proteção de rotas privadas (redirect para login se não autenticado); tela de listagem de usuários (visível para `admin` e `manager`); tela de criação de usuário com controle de role por permissão.

### 🚚 Release 4: Orquestração de Pedidos, Visão de Vendas e Documentação

Objetivo Arquitetural: Finalizar o ciclo de vida da transação, oferecer inteligência básica de vendas e consolidar artefatos arquiteturais.

#### Pedidos
• **DB**: Criação das tabelas `orders` e `order_items`; migration SQL versionada: `04-create-orders.sql`.

• **API**: `POST /api/store/checkout` (conversão de carrinho ativo em pedido definitivo), `GET /api/store/orders` (histórico de pedidos do cliente por session/cookie), `GET /api/admin/orders` (listagem geral de pedidos para o admin) e `PATCH /api/admin/orders/:id/status` (atualização de status logístico).

• **apps/frontend/storefront/**: Tela de Checkout final e área "My Orders" (Meus Pedidos).

• **apps/frontend/backoffice/**: Painel logístico de status de entrega.

#### Visão de Vendas (Dashboard)
• **API**: `GET /api/admin/reports/sales` — retorna quantidade total vendida por produto e renda bruta total acumulada (sem filtro por período).

• **apps/frontend/backoffice/**: Tela de Dashboard de Vendas — acessível por **todas as roles** (`admin`, `manager`, `user`). Exibe quantidade de cada produto vendido e renda bruta total.

#### Artefatos de Engenharia
• **Engenharia**: Diagrama de Entidade-Relacionamento (DER), Diagrama de Classes e Diagrama de Arquitetura.
