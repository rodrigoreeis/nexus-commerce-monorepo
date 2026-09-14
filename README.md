# 🛒 Nexus Commerce

> **Software Product: Analysis, Specification, Project & Implementation**  
> **Repositório:** [github.com/rodrigoreeis/nexus-commerce-monorepo](https://github.com/rodrigoreeis/nexus-commerce-monorepo)  
> **Quadro Ágil (Board):** [github.com/users/rodrigoreeis/projects/2](https://github.com/users/rodrigoreeis/projects/2)  
> **Apresentação em HTML (Full Screen):** [docs/apresentacao-sharepoint.html](docs/apresentacao-sharepoint.html)

---

## 📖 O que é o Projeto?

O **Nexus Commerce** é um **ecossistema completo de e-commerce** construído sob a arquitetura de **Monorepo Centralizado** e abordagem **API-First (Monólito Modular)**, integrando a jornada de compra do consumidor final a um painel de retaguarda administrativa (backoffice) para a gestão do negócio:

- **E-commerce (Storefront):** Vitrine pública de alta performance voltada para o consumidor final, com catálogo aberto, exibição de fotos e fluxo de compra.
- **Painel de Gestão (Backoffice):** Aplicação Single Page Application (SPA) para os lojistas, com cadastro de produtos, upload local de imagens e controle do catálogo ativo.

### 🎯 Abordagem: Fatias Verticais (Vertical Slicing)

Em estrita conformidade com o **Manifesto Ágil**, o projeto não desenvolve camadas horizontais isoladas. Toda entrega percorre o ecossistema ponta a ponta:  
$$\text{Banco de Dados Relacional} \longrightarrow \text{API Backend} \longrightarrow \text{Backoffice} \longrightarrow \text{Storefront}$$

---

## ⚡ Tecnologias Utilizadas

### 🎨 Front-end

- **React 19 & Next.js 16:** SSR, SEO e renderização eficiente no Storefront.
- **Vite 8:** Build rápido e desenvolvimento ágil da SPA do Backoffice.
- **TypeScript:** Tipagem estática em todas as aplicações client-side.
- **Tailwind CSS:** Estilização moderna e responsiva na vitrine pública.
- **Chakra UI v3:** Componentes acessíveis para formulários e tabelas do lojista.
- **TanStack React Query & Axios:** Gerenciamento de cache assíncrono e requisições HTTP padronizadas.

### ⚙️ Back-end & Banco de Dados

- **Golang 1.24:** API REST central com **Gin Engine**.
- **PostgreSQL 16 Alpine:** Persistência relacional robusta com transações ACID.
- **Raw SQL (Sem ORM):** Consultas escritas em SQL nativo via `database/sql` e driver `github.com/lib/pq`, garantindo alta performance e planos de execução transparentes.
- **Podman (Rootless):** Conteinerização isolada do banco sem dependência de daemon root.
- **Bruno:** Coleções de testes automatizados de API versionadas em texto plano no Git (substituindo Postman/Insomnia).

### 🤖 Inteligência Artificial

- **Google Antigravity (IA):** Desenvolvimento acelerado com agentes especializados (_Product Manager, Tech Planner, Backend e Frontend Specialists_) orientados por _skills_ técnicas e restrições arquiteturais.

---

## 🚀 Como Rodar Localmente

### 📋 Pré-requisitos

- [Go 1.24+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/) e `npm`
- [Podman](https://podman.io/) (ou Docker) com plugin `compose`
- `make` instalado no sistema operacional
- _(Opcional)_ [Bruno Client](https://www.usebruno.com/) para executar as coleções de teste de API

---

### 1️⃣ Subir o Banco de Dados (PostgreSQL via Podman)

O banco de dados roda isolado em um container gerenciado via `apps/backend/compose.yml`.

1. Acesse o diretório do backend:

   ```bash
   cd apps/backend
   ```

2. Suba o container do PostgreSQL em background:

   ```bash
   make compose-up
   ```

   _(Caso não tenha `podman-compose`, o Makefile tentará automaticamente `docker compose`)._

3. Credenciais e conexão padrão:
   - **Host:** `localhost`
   - **Porta:** `5432`
   - **Banco:** `nexus_commerce`
   - **Usuário:** `nexus_user`
   - **Senha:** `nexus_pass`

4. _(Opcional)_ Verifique se o container está saudável:
   ```bash
   podman ps --filter name=nexus_postgres
   ```

---

### 2️⃣ Rodar as Migrações SQL

As tabelas do banco são criadas e versionadas por meio de scripts SQL numerados em `apps/backend/migrations/`.

No diretório `apps/backend`, execute:

```bash
make migrate
```

O comando executará sequencialmente no container:

- `migrations/01-initial-setup.sql` — Extensões e setup inicial.
- `migrations/02-create-products.sql` — Criação da tabela `products`.

---

### 3️⃣ Iniciar a API em Golang (Nexus API)

Com o banco de dados ativo e migrado:

1. No diretório `apps/backend`, inicie o servidor HTTP:

   ```bash
   make run
   ```

2. A API iniciará na porta **`:8080`**:
   - **Health Check:** [http://localhost:8080/health](http://localhost:8080/health)
   - **Produtos (Público):** `GET http://localhost:8080/api/store/products`
   - **Uploads de Imagens:** `http://localhost:8080/uploads/:filename`

---

### 4️⃣ Iniciar o Backoffice (Painel do Lojista)

Em um novo terminal:

1. Acesse a pasta do Backoffice:

   ```bash
   cd apps/frontend/backoffice
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse no navegador: **[http://localhost:5173](http://localhost:5173)**.  
   _Navegue até a seção de produtos para cadastrar novos itens com foto e visualizar a tabela._

---

### 5️⃣ Iniciar o Storefront (Vitrine do Consumidor)

Em outro terminal:

1. Acesse a pasta do Storefront:

   ```bash
   cd apps/frontend/storefront
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie a aplicação Next.js:

   ```bash
   npm run dev
   ```

4. Acesse no navegador: **[http://localhost:3000](http://localhost:3000)**.  
   _A vitrine exibirá imediatamente os produtos cadastrados no Backoffice._

---

## 🧪 Como Executar os Testes

### 📡 Testes de API com Bruno

A pasta `apps/backend/bruno/` contém as requisições com asserções automatizadas.

- **Pelo Bruno Desktop:** Abra a pasta `apps/backend/bruno/`, selecione o ambiente `Local` e execute os endpoints de `admin` e `store`.
- **Pelo Bruno CLI:**
  ```bash
  bru run apps/backend/bruno --env Local
  ```

### 🔬 Testes Unitários de Front-end (Jest)

- **Backoffice:**
  ```bash
  cd apps/frontend/backoffice
  npm test
  ```
- **Storefront:**
  ```bash
  cd apps/frontend/storefront
  npm test
  ```

---

## 📁 Estrutura do Monorepo

```text
nexus-commerce-monorepo/
├── apps/
│   ├── backend/                  # API em Go, migrations SQL, Makefile e Bruno
│   │   ├── bruno/                # Coleção de testes de API versionada no Git
│   │   ├── migrations/           # Scripts SQL (01-initial-setup.sql, 02-create-products.sql)
│   │   ├── postgres/             # Repositórios SQL nativos (database/sql)
│   │   ├── service/              # Handlers HTTP, regras de negócio e upload
│   │   ├── uploads/              # Imagens locais salvas pelo backend
│   │   ├── compose.yml           # Serviço PostgreSQL (Podman)
│   │   ├── Makefile              # Automação (compose-up, migrate, run)
│   │   └── main.go               # Ponto de entrada da API
│   └── frontend/
│       ├── backoffice/           # Painel do lojista (React 19 + Vite 8 + Chakra UI v3)
│       └── storefront/           # Vitrine pública (Next.js 16 + React 19 + Tailwind CSS)
├── docs/                         # Documentações e apresentação em HTML
│   ├── apresentacao-sharepoint.html # Apresentação interativa Full Screen
│   ├── ARCHITECTURE.md           # Decisões de arquitetura
│   ├── PROJECT.MD                # Especificação de escopo
│   └── ROADMAP.MD                # Roadmap de releases (R0 a R4)
└── skills/                       # Skills e regras dos Agentes de IA
```
