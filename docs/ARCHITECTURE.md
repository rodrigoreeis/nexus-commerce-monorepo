# 🏛️ Documento de Arquitetura: Nexus Commerce

Este documento descreve as decisões arquiteturais, o ecossistema tecnológico e a infraestrutura de CI/CD adotados no desenvolvimento da plataforma Nexus Commerce.

## 1. Padrão Arquitetural

O projeto adota uma arquitetura de **Monólito Modular (API-First)** para o back-end, servindo a clientes front-end totalmente desacoplados. Essa abordagem garante a simplicidade de um único serviço de back-end para deploy e manutenção, enquanto isola os domínios de negócio através de rotas lógicas (namespaces).

## 2. Ecossistema e Stack Tecnológica

### 2.1. Front-end (Clientes Desacoplados)

As interfaces de usuário são divididas em duas aplicações distintas para atender aos requisitos específicos de cada público-alvo:

- **Storefront (Vitrine):** Construído com **Next.js 16** e **React 19**. Foco em alta performance, otimização de motores de busca (SEO) e renderização no lado do servidor (SSR/Turbopack).
- **Backoffice (Painel Admin):** Construído com **React 19 + Vite 8**. Trata-se de uma Single Page Application (SPA) clássica, focada na dinamicidade de formulários, tabelas e gestão de estado no lado do cliente.
- **Padrão de Comunicação e Estado de Servidor:**
  - **Cliente HTTP:** **Axios** é o cliente HTTP padronizado para todas as requisições para a Nexus API Go.
  - **Server State & Cache:** **TanStack React Query** (`@tanstack/react-query`) é obrigatório para gerenciamento de cache assíncrono, estados de loading/error, sincronização e invalidação reativa de queries em ambas as aplicações.

### 2.2. Back-end (Nexus API)

- **Linguagem:** **Golang (Go)**. Escolhido por sua alta performance, tipagem estática e excelente manipulação de concorrência.
- **Design de Rotas:** O sistema rodará em um único binário, mas com separação rigorosa de escopo via roteamento:
  - `/api/store/*`: Endpoints voltados à jornada do cliente (carrinho, checkout, listagem pública).
  - `/api/admin/*`: Endpoints protegidos para gestão logística e de catálogo.

### 2.3. Banco de Dados e Persistência

- **Engine Relacional:** **PostgreSQL 16** (`postgres:16-alpine`). Focado em integridade referencial rigorosa (ACID) para lidar com transações de pedidos, concorrência e consistência de catálogo e estoque.
- **Conteinerização com Podman:**
  - O banco de dados opera isolado em contêiner gerenciado via **Podman** (`podman compose` / `compose.yml` localizado em `apps/backend/compose.yml`).
  - O uso do Podman garante execução em modo **rootless** (sem privilégios de root) e sem dependência de daemons centralizados pesados, assegurando maior segurança e aderência a ambientes corporativos e acadêmicos modernos.
  - **Nome do Container:** `nexus_postgres`, com healthcheck ativo configurado via `pg_isready` para validar disponibilidade.
  - **Mapeamento de Porta:** Exposição da porta `5432:5432` acessível pela API Go local.
  - **Persistência de Dados:** Uso de volume nomeado (`pgdata:/var/lib/postgresql/data`) para assegurar a perenidade dos dados transacionais entre paradas e reinicializações de contêineres (`compose-up` / `compose-down`).
  - **Credenciais Padrão Locais:** Banco `nexus_commerce`, usuário `nexus_user`, senha `nexus_pass`.
- **Acesso a Dados (Raw SQL - Sem ORM):**
  - As consultas são escritas exclusivamente em **SQL nativo** utilizando o pacote padrão do Go (`database/sql`) associado ao driver PostgreSQL (`github.com/lib/pq`).
  - Proibido o uso de ORMs (GORM, Prisma, TypeORM). Essa decisão arquitetural prioriza performance bruta, clareza sobre planos de execução de queries, eliminação de sobrecarga (overhead) computacional e evita abstrações mágicas.
- **Ciclo de Migrações (Imutabilidade e Versionamento):**
  - Todas as estruturas relacionais evoluem por meio de scripts SQL numerados sequencialmente em `apps/backend/migrations/` (ex: `01-initial-setup.sql`).
  - A execução de migrações é acionada via `make migrate`, que canaliza os scripts diretamente para o contêiner Podman (`podman exec -i nexus_postgres psql ...`), garantindo imutabilidade histórica sem ferramentas de migração proprietárias.

## 3. Gestão de Repositório e Infraestrutura (CI/CD)

O projeto adota uma estrutura de Monorepo organizada na pasta `apps/` (`apps/backend/`, `apps/frontend/storefront/` e `apps/frontend/backoffice/`), sem o overhead de ferramentas complexas como Nx ou Turborepo.

- **Isolamento de Build:** Cada aplicação possui seu próprio processo de build e scripts de dependência independentes (`package.json` para os frontends e `go.mod` / `Makefile` para o backend).
- **Ambiente de Desenvolvimento Local:**
  - `make compose-up`: Inicia o container PostgreSQL no Podman em background.
  - `make migrate`: Aplica todas as migrações SQL pendentes dentro do container.
  - `make run`: Executa a Nexus API localmente conectando-se ao PostgreSQL conteinerizado.
  - Frontends rodam de forma desacoplada (`npm run dev`) em suas respectivas pastas.
- **Orquestração de Deploy e CI:** O pipeline de CI/CD é gerenciado nativamente pelo **GitHub Actions**. As _actions_ identificam os caminhos alterados (`apps/backend/**`, `apps/frontend/storefront/**` ou `apps/frontend/backoffice/**`) para disparar testes, linters e builds de forma isolada e paralela.

## 4. Diagrama de Comunicação de Alto Nível (Contexto)

```text
[ Cliente Final ]               [ Administrador ]
       |                                |
       |                                |
       v                                v
+------------------+           +------------------+
|    Storefront    |           |    Backoffice    |
| (Next.js 16/R19) |           | (React 19/Vite 8)|
|  :3000           |           |  :5173           |
+------------------+           +------------------+
       |                                |
       |  HTTP/JSON                     |  HTTP/JSON
       |  /api/store/*                  |  /api/admin/*
       |                                |
       +--------------> [ Nexus API ] <--+
                        |  (Golang) |
                        |   :8080   |
                        +-----------+
                              |
                              | TCP :5432 (database/sql)
                              v
                +-------------------------------+
                |     Podman Containerized      |
                |   [ Container: nexus_postgres ]
                |   - Image: postgres:16-alpine |
                |   - Volume: pgdata            |
                |   - Database: nexus_commerce  |
                +-------------------------------+
```
