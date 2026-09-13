# Projeto: Nexus Commerce (Monorepo)

**Contexto:** Trabalho acadêmico com foco na aplicação prática do Manifesto Ágil (entregas em fatias verticais), arquitetura de software e desenvolvimento acelerado com agentes de IA.

---

## 🎯 Visão Geral do Monorepo

O Nexus Commerce é uma plataforma de e-commerce construída como um **Monorepo Centralizado**, onde todo o ecossistema do projeto (aplicações de frontend, serviços de backend, scripts de banco de dados, documentação, agentes de IA e skills) reside em um único repositório.

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
│   ├── storefront/           # Vitrine pública do consumidor (Next.js + Tailwind CSS)
│   └── backoffice/           # Painel administrativo do lojista (React + Vite.js + Tailwind CSS)
├── skills/                   # Manuais técnicos e convenções em formato Antigravity (SKILL.md)
│   ├── backend/              # Skills de Golang, PostgreSQL e Clean Code
│   ├── frontend/             # Skills de Next.js, React, Design System e Acessibilidade
│   ├── best-practices/       # Skills de segurança e código limpo
│   └── conventions/          # Convenções de commits e estrutura
├── .agents/                  # Definição dos Agentes do projeto
│   └── agents/               # Agentes (product-manager, planner, backend-specialist, frontend-specialist)
└── docs/                     # Documentação oficial (PROJECT.MD, ARCHITECTURE.md, ROADMAP.MD)
```

---

## 🏗️ Estrutura das Aplicações

O sistema separa claramente o ecossistema entre `backend/` e `frontend/`:

- **`backend/` (Nexus API Única em Go):** API central que gerencia todo o domínio do e-commerce e interage com o PostgreSQL via Raw SQL. Possui separação lógica de rotas:
  - `/api/store/...` para consumo da aplicação Storefront.
  - `/api/admin/...` para consumo da aplicação Backoffice.
- **`frontend/storefront/`:** Vitrine pública focada na experiência do consumidor final (SSR/SEO).
- **`frontend/backoffice/`:** Painel administrativo para gestão de catálogo, produtos e pedidos.

---

## ⚠️ Regras e Restrições Globais (Crucial para Agentes de IA)

1. **Monorepo Unificado:** Todas as alterações, novas funcionalidades, migrações e telas devem ser adicionadas dentro das respetivas pastas `backend/` ou `frontend/`.
2. **Vertical Slicing:** Nenhuma camada (Front, Back ou DB) deve ser desenvolvida isoladamente. Toda funcionalidade deve cruzar as três camadas.
3. **Restrição da Release 1:** É ESTRITAMENTE PROIBIDO implementar qualquer mecanismo de autenticação (Login/Logout, JWT, Sessions) na primeira entrega.
4. **Padrões de Código:** Manter a separação clara de responsabilidades lógicas dentro da API (`/api/store` vs `/api/admin`), mesmo compartilhando o mesmo banco de dados.

---

## 🗺️ Roadmap de Entregas (Releases)

### Release 1: Catálogo Digital Mínimo Viável (MVP)

**Objetivo Arquitetural:** Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

- **`backend/`:** Modelagem do banco; criação da tabela `Produtos`; endpoints na API em `/api/admin/produtos` e `/api/store/produtos`.
- **`frontend/backoffice/`:** Interface para inserção de dados (formulário de novo produto) e listagem interna.
- **`frontend/storefront/`:** Exibição da grade de produtos em tempo real.

### Release 2: Jornada de Compra (Carrinho Anônimo)

**Objetivo Arquitetural:** Introduzir interatividade no client-side e gestão de estado temporário.

- **`backend/`:** Criação de tabelas de `Carrinhos` e `Itens_Carrinho` atreladas a um ID de sessão de navegação; endpoints em `/api/store/carrinho` para adicionar, remover e calcular subtotal.
- **`frontend/storefront/`:** Detalhes do produto; drawer/página de carrinho com cálculo dinâmico de valores.

### Release 3: Gestão de Identidade e Controle de Acesso (RBAC)

**Objetivo Arquitetural:** Fechar o perímetro de segurança implementando autenticação e separação de perfis na API.

- **`backend/`:** Tabela de `Usuarios` com coluna de papel (`role`: admin/cliente); geração e validação de tokens JWT. Inclusão de middlewares de autorização para bloquear as rotas `/api/admin/*`. Regra para vincular carrinho anônimo ao usuário recém-logado.
- **`frontend/backoffice/`:** Tela de Login; proteção das rotas privadas no client-side.
- **`frontend/storefront/`:** Tela de Login/Cadastro para o cliente final.

### Release 4: Orquestração de Pedidos e Documentação

**Objetivo Arquitetural:** Finalizar o ciclo de vida da transação e gerar artefatos formais.

- **`backend/`:** Tabelas `Pedidos` e `Itens_Pedido`; conversão de carrinho em pedido; rotas para listagem (cliente vs. admin) e atualização de status logístico.
- **`frontend/storefront/`:** Tela de checkout e área "Meus Pedidos".
- **`frontend/backoffice/`:** Painel de gestão para atualização do status de entrega.
- **Artefatos:** Geração dos Diagramas de Entidade-Relacionamento (DER), Classes e Arquitetura.
