# 🗺️ Roadmap do Projeto: Nexus Commerce

Este documento descreve as etapas de desenvolvimento do Nexus Commerce, estruturadas em **5 marcos** (R0 + R1–R4) com entregas em fatias verticais (Vertical Slicing), seguindo os princípios do Manifesto Ágil.

> **Convenção global:** todos os nomes de tabelas e endpoints estão em **inglês**, seguindo o padrão da comunidade de software.

---

## ⚙️ Release 0: Infraestrutura e Base Técnica do Monorepo

**Objetivo:** Criar o esqueleto técnico completo de todas as aplicações antes de qualquer desenvolvimento de negócio. Este marco é um pré-requisito para todas as demais releases.

### Infraestrutura (Podman + PostgreSQL)
- [ ] **Infra:** Criar `compose.yml` com serviço PostgreSQL (Podman). A API Go roda localmente via `make run`.
- [ ] **Infra:** Criar `Makefile` com targets `run`, `build` e `migrate`.

### Backend (Go — Nexus API)
> Seguir estritamente a skill `skills/backend/golang-api-architecture`.
- [ ] **Backend:** Inicializar módulo Go (`go.mod`) com dependências: Gin, pgx/lib-pq.
- [ ] **Backend:** Criar `main.go` (ponto de entrada).
- [ ] **Backend:** Criar `cmd/api.go` (inicialização do servidor Gin e injeção de dependências).
- [ ] **Backend:** Criar `config/environments.go` (carregamento de configurações via `config.toml`).
- [ ] **Backend:** Criar `config.toml` com variáveis de ambiente (porta, DSN do PostgreSQL).
- [ ] **Backend:** Criar `postgres/connection.go` (pool de conexões).
- [ ] **Backend:** Criar `postgres/store.go` (interface `Storage` e struct `Store`).
- [ ] **Backend:** Criar `routers/routers.go` (registro de rotas HTTP).
- [ ] **Backend:** Criar `service/service.go` (struct `Service`, helpers de resposta JSON, slog).
- [ ] **Backend:** Criar `utils/crypto.go` (placeholder para hash e JWT).
- [ ] **Backend:** Criar `migrations/` com script SQL de setup inicial do banco.
- [x] **Backend:** Inicializar coleção oficial do Bruno em `apps/backend/bruno/` com o endpoint de health check (seguir `skills/backend/bruno-collection-generator`).

### Backoffice (React + Vite + TypeScript + Chakra UI)
> Seguir as skills `skills/frontend/architecture-agent` e `skills/frontend/simplicity-and-structural-conventions`.
- [ ] **Backoffice:** Scaffold com Vite + React + TypeScript.
- [ ] **Backoffice:** Instalar e configurar Chakra UI v3 (`@chakra-ui/react @emotion/react`).
- [ ] **Backoffice:** Configurar `tsconfig.app.json` com paths (`@/*`) e `vite.config.ts` com `vite-tsconfig-paths`.
- [ ] **Backoffice:** Criar estrutura de pastas: `src/pages/`, `src/shared/components/`, `src/shared/utils/`, `src/shared/theme/`.
- [ ] **Backoffice:** Criar `src/shared/theme/tokens.ts` com tokens de UI (cores, spacing, tipografia, radius, shadows).
- [ ] **Backoffice:** Criar componentes base: `Layout`, `Header`, `Container`.
- [ ] **Backoffice:** Configurar Jest para testes unitários.

### Storefront (Next.js + TypeScript + TailwindCSS)
> Seguir as skills `skills/frontend/architecture-agent` e `skills/frontend/simplicity-and-structural-conventions`.
- [ ] **Storefront:** Scaffold com Next.js + TypeScript.
- [ ] **Storefront:** Instalar e configurar TailwindCSS.
- [ ] **Storefront:** Criar estrutura de pastas: `src/pages/`, `src/shared/components/`, `src/shared/utils/`, `src/shared/theme/`.
- [ ] **Storefront:** Criar `src/shared/theme/tokens.ts` com tokens de UI base.
- [ ] **Storefront:** Criar componentes base: `Layout`, `Header`, `Container`.
- [ ] **Storefront:** Configurar Jest para testes unitários.

---

## 📦 Release 1: Catálogo Digital Mínimo Viável (MVP)

**Objetivo:** Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

- [ ] **DB:** Criação da tabela `products`.
- [ ] **DB:** Migration SQL versionada: `01-create-products.sql`.
- [ ] **API:** Endpoint `POST /api/admin/products` — cadastro de produto.
- [ ] **API:** Endpoint `GET /api/store/products` — listagem pública de produtos.
- [ ] **Backoffice:** Formulário de cadastro de produto (tela).
- [ ] **Backoffice:** Tela de listagem interna do catálogo.
- [ ] **Storefront:** Vitrine pública com grade de produtos consumindo a API.

---

## 🛒 Release 2: Jornada de Compra (Carrinho Anônimo)

**Objetivo:** Introduzir interatividade no client-side e gestão de estado temporário no back-end.

- [ ] **DB:** Criação das tabelas `carts` (por Session ID) e `cart_items`.
- [ ] **DB:** Migration SQL versionada: `02-create-carts.sql`.
- [ ] **API:** `POST /api/store/cart/items` — adicionar item ao carrinho.
- [ ] **API:** `DELETE /api/store/cart/items/:id` — remover item do carrinho.
- [ ] **API:** `PATCH /api/store/cart/items/:id` — atualizar quantidade.
- [ ] **API:** `GET /api/store/cart` — obter carrinho com subtotal calculado dinamicamente.
- [ ] **Storefront:** Página de detalhes do produto.
- [ ] **Storefront:** Interface do carrinho (drawer ou página dedicada) integrada à API.

---

## 🔐 Release 3: Gestão de Identidade e Controle de Acesso (RBAC)

**Objetivo:** Implementar autenticação JWT e RBAC no Backoffice para os lojistas. O Storefront permanece anônimo nesta release.

### Regras de Negócio de Roles

| Role | Criar usuário `user` | Criar usuário `manager` | Criar/promover `admin` | Ver lista de usuários |
|---|---|---|---|---|
| `admin` | ✅ | ✅ | ✅ | ✅ |
| `manager` | ✅ | ❌ | ❌ | ✅ |
| `user` | ❌ | ❌ | ❌ | ❌ |

- O primeiro `admin` (root) é criado **manualmente via banco de dados**.
- **Não há tela de cadastro público** — usuários do Backoffice só são criados internamente por `admin` ou `manager`.
- Usuários do Backoffice são **completamente separados** dos consumidores do Storefront.

### Itens da Release
- [ ] **DB:** Criação da tabela `backoffice_users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`).
- [ ] **DB:** Migration SQL versionada: `03-create-backoffice-users.sql`.
- [ ] **API:** `POST /api/admin/auth/login` — autenticação e geração de JWT.
- [ ] **API:** `POST /api/admin/users` — criar usuário (admin/manager com regras de role).
- [ ] **API:** `GET /api/admin/users` — listar usuários do Backoffice.
- [ ] **API:** `PATCH /api/admin/users/:id/role` — alterar role (somente `admin`).
- [ ] **API:** Middleware JWT protegendo todas as rotas `/api/admin/*` (exceto `/api/admin/auth/login`).
- [ ] **Backend:** `utils/crypto.go` — implementação de hash de senha (bcrypt) e geração/validação de JWT.
- [ ] **Backoffice:** Tela de Login.
- [ ] **Backoffice:** Proteção de rotas privadas no client-side (redirect para login se não autenticado).
- [ ] **Backoffice:** Tela de listagem de usuários (visível para `admin` e `manager`).
- [ ] **Backoffice:** Tela de criação de usuário com controle de role por permissão.

---

## 🚚 Release 4: Orquestração de Pedidos, Visão de Vendas e Documentação

**Objetivo:** Finalizar o ciclo de vida da transação, oferecer inteligência básica de vendas e consolidar os artefatos arquiteturais.

### Pedidos
- [ ] **DB:** Criação das tabelas `orders` e `order_items`.
- [ ] **DB:** Migration SQL versionada: `04-create-orders.sql`.
- [ ] **API:** `POST /api/store/checkout` — conversão de carrinho ativo em pedido definitivo.
- [ ] **API:** `GET /api/store/orders` — histórico de pedidos do cliente (por session/cookie).
- [ ] **API:** `GET /api/admin/orders` — listagem geral de pedidos para o admin.
- [ ] **API:** `PATCH /api/admin/orders/:id/status` — atualização de status logístico.
- [ ] **Storefront:** Tela de Checkout final.
- [ ] **Storefront:** Área "My Orders" (Meus Pedidos).
- [ ] **Backoffice:** Painel de gestão logística para atualização de status de entrega.

### Visão de Vendas (Dashboard)
- [ ] **API:** `GET /api/admin/reports/sales` — retorna quantidade total vendida por produto e renda bruta total acumulada (sem filtro por período).
- [ ] **Backoffice:** Tela de Dashboard de Vendas — acessível por **todas as roles** (`admin`, `manager`, `user`). Exibe: quantidade de cada produto vendido e renda bruta total.

### Artefatos de Engenharia
- [ ] **Engenharia:** Diagrama de Entidade-Relacionamento (DER).
- [ ] **Engenharia:** Diagrama de Classes.
- [ ] **Engenharia:** Diagrama de Arquitetura.
