**# Projeto: Nexus Commerce (Monorepo)**

**Contexto:** Trabalho acadêmico com foco na aplicação prática do Manifesto Ágil (entregas em fatias verticais), arquitetura de software e desenvolvimento acelerado com agentes de IA.

---

## 🎯 Visão Geral do Monorepo

O Nexus Commerce é uma plataforma de e-commerce construída como um **Monorepo Centralizado**, onde todo o ecossistema do projeto (aplicações de frontend, serviços de backend, scripts

de banco de dados, documentação, agentes de IA e skills) reside em um único repositório.

A arquitetura adota uma abordagem **API-First (Monólito Modular no Backend)** com clientes desacoplados no Frontend, estruturada nas pastas principais do repositório:

```text
nexus-commerce-monorepo/
├── backend/                  # Código-fonte da API central em Golang e migrações SQL
│   ├── cmd/                  # Servidor HTTP e injeção de dependências
│   ├── config/               # Carregamento de configurações e variáveis de ambiente
│   ├── migrations/           # Scripts SQL versionados para o PostgreSQL
│   ├── postgres/             # Conexão e repositórios de acesso ao banco (database/sql)
│   ├── routers/              # Registro e agrupamento de rotas HTTP
│   ├── service/              # Camada de serviços de negócio e handlers HTTP
│   └── utils/                # Criptografia, hashing e funções auxiliares
├── frontend/                 # Aplicações client-side
│   ├── storefront/           # Vitrine pública do consumidor (Next.js + TailwindCSS)
│   └── backoffice/           # Painel administrativo do lojista (React + Vite + Chakra UI v3)
├── skills/                   # Manuais técnicos e convenções em formato Antigravity (SKILL.md)
│   ├── backend/              # Skills de Golang, PostgreSQL e Clean Code
│   ├── frontend/             # Skills de Next.js, React, Design System e Acessibilidade
│   ├── best-practices/       # Skills de segurança e código limpo
│   └── conventions/          # Convenções de commits e estrutura
├── .agents/                  # Definição dos Agentes do projeto
│   └── agents/               # Agentes (product-manager, planner, backend-specialist, frontend-specialist)
└── docs/                     # Documentação oficial (PROJECT.MD, ARCHITECTURE.md, ROADMAP.MD)
──────

**## 🏗️ Estrutura das Aplicações**

O sistema separa claramente o ecossistema entre backend/ e frontend/:

• backend/ (Nexus API em Go): API central que gerencia todo o domínio do e-commerce e interage com o PostgreSQL via Raw SQL. Possui separação lógica de rotas:

• /api/store/... para consumo da aplicação Storefront.

• /api/admin/... para consumo da aplicação Backoffice.

• frontend/storefront/: Vitrine pública focada na experiência do consumidor final (SSR/SEO) — Next.js + TypeScript + TailwindCSS.

• frontend/backoffice/: Painel administrativo para gestão de catálogo, produtos, usuários e pedidos — React + Vite + TypeScript + Chakra UI v3.

**### Setup de Desenvolvimento Local**

• PostgreSQL: sobe via Podman usando compose.yml (podman-compose up -d).

• API Go: roda localmente via make run.

• Convenção global: todos os nomes de tabelas e endpoints estão em inglês.

──────

**## ⚠️ Regras e Restrições Globais (Crucial para Agentes de IA)**

1\. Monorepo Unificado: Todas as alterações, novas funcionalidades, migrações e telas devem ser adicionadas dentro das respectivas pastas backend/ ou frontend/.

2\. Vertical Slicing: Nenhuma camada (Front, Back ou DB) deve ser desenvolvida isoladamente. Toda funcionalidade deve cruzar as três camadas.

3\. Restrição da Release 1: É ESTRITAMENTE PROIBIDO implementar qualquer mecanismo de autenticação (Login/Logout, JWT, Sessions) na primeira entrega.

4\. Padrões de Código: Manter a separação clara de responsabilidades lógicas dentro da API (/api/store vs /api/admin), mesmo compartilhando o mesmo banco de dados.

5\. Nomenclatura em Inglês: Todos os nomes de tabelas SQL e endpoints HTTP devem estar em inglês.

6\. Skills Obrigatórias: Os agentes de IA devem sempre consultar as skills em skills/ antes de escrever código.

──────

**## 🗺️ Roadmap de Entregas (Releases)**

**### ⚙️ Release 0: Infraestrutura e Base Técnica do Monorepo**

Objetivo Arquitetural: Criar o esqueleto técnico completo de todas as aplicações antes de qualquer desenvolvimento de negócio. Pré-requisito obrigatório para todas as demais releases.

• Infra: compose.yml com PostgreSQL via Podman; Makefile com targets run, build e migrate.

• backend/: Scaffold completo Go — main.go, cmd/api.go, config/environments.go, config.toml, postgres/connection.go, postgres/store.go, routers/routers.go, service/service.go,

utils/crypto.go, migrations/.

• frontend/backoffice/: Scaffold Vite + React + TypeScript + Chakra UI v3; estrutura de pastas src/pages/, src/shared/; tokens de UI; componentes base (Layout, Header, Container); Jest

configurado.

• frontend/storefront/: Scaffold Next.js + TypeScript + TailwindCSS; estrutura de pastas src/pages/, src/shared/; tokens de UI; componentes base (Layout, Header, Container); Jest

configurado.

**### 📦 Release 1: Catálogo Digital Mínimo Viável (MVP)**

Objetivo Arquitetural: Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

• backend/: Tabela products; migration 01-create-products.sql; endpoints POST /api/admin/products e GET /api/store/products.

• frontend/backoffice/: Formulário de cadastro de produto e tela de listagem do catálogo.

• frontend/storefront/: Vitrine pública com grade de produtos.

**### 🛒 Release 2: Jornada de Compra (Carrinho Anônimo)**

Objetivo Arquitetural: Introduzir interatividade no client-side e gestão de estado temporário no back-end.

• backend/: Tabelas carts e cart\_items (por Session ID); migration 02-create-carts.sql; endpoints POST /api/store/cart/items, DELETE /api/store/cart/items/\:id, PATCH

/api/store/cart/items/\:id, GET /api/store/cart (com subtotal dinâmico).

• frontend/storefront/: Página de detalhes do produto; interface do carrinho integrada à API.

**### 🔐 Release 3: Gestão de Identidade e Controle de Acesso (RBAC)**

Objetivo Arquitetural: Implementar autenticação JWT e RBAC no Backoffice para lojistas. Storefront permanece anônimo.

Regras de roles:

• admin → poder total (cria qualquer role, inclusive outros admins).

• manager → pode criar somente usuários user.

• user → sem permissão de gerenciamento.

• Primeiro admin (root) criado manualmente via banco de dados. Sem tela de cadastro público.

• Usuários do Backoffice são completamente separados dos consumidores do Storefront.

• backend/: Tabela backoffice\_users (id, name, email, password\_hash, role, created\_at); migration 03-create-backoffice-users.sql; endpoints de auth e gerenciamento de usuários;

middleware JWT protegendo /api/admin/*; bcrypt + JWT em utils/crypto.go.

• frontend/backoffice/: Tela de Login; proteção de rotas privadas; tela de listagem e criação de usuários com controle de role por permissão.

**### 🚚 Release 4: Orquestração de Pedidos, Visão de Vendas e Documentação**

Objetivo Arquitetural: Finalizar o ciclo de vida da transação, oferecer inteligência básica de vendas e consolidar artefatos arquiteturais.

• backend/: Tabelas orders e order\_items; migration 04-create-orders.sql; endpoints de checkout, listagem de pedidos (cliente e admin), atualização de status logístico e GET

/api/admin/reports/sales (quantidade total vendida por produto + renda bruta total acumulada).

• frontend/storefront/: Tela de Checkout e área "My Orders".

• frontend/backoffice/: Painel logístico de status de entrega; Dashboard de Vendas acessível por todas as roles (quantidade vendida por produto + renda bruta total).

• Artefatos: Diagramas de Entidade-Relacionamento (DER), Classes e Arquitetura.
```
