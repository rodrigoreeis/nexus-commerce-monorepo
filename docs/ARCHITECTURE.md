# 🏛️ Documento de Arquitetura: Nexus Commerce

Este documento descreve as decisões arquiteturais, o ecossistema tecnológico e a infraestrutura de CI/CD adotados no desenvolvimento da plataforma Nexus Commerce.

## 1. Padrão Arquitetural

O projeto adota uma arquitetura de **Monólito Modular (API-First)** para o back-end, servindo a clientes front-end totalmente desacoplados. Essa abordagem garante a simplicidade de um único serviço de back-end para deploy e manutenção, enquanto isola os domínios de negócio através de rotas lógicas (namespaces).

## 2. Ecossistema e Stack Tecnológica

### 2.1. Front-end (Clientes Desacoplados)

As interfaces de usuário são divididas em duas aplicações distintas para atender aos requisitos específicos de cada público-alvo:

- **Storefront (Vitrine):** Construído com **Next.js**. Foco em alta performance, otimização de motores de busca (SEO) e renderização no lado do servidor (SSR).
- **Backoffice (Painel Admin):** Construído com **React + Vite**. Trata-se de uma Single Page Application (SPA) clássica, focada na dinamicidade de formulários, tabelas e gestão de estado no lado do cliente.

### 2.2. Back-end (Nexus API)

- **Linguagem:** **Golang (Go)**. Escolhido por sua alta performance, tipagem estática e excelente manipulação de concorrência.
- **Design de Rotas:** O sistema rodará em um único binário, mas com separação rigorosa de escopo via roteamento:
  - `/api/store/*`: Endpoints voltados à jornada do cliente (carrinho, checkout, listagem pública).
  - `/api/admin/*`: Endpoints protegidos para gestão logística e de catálogo.

### 2.3. Banco de Dados e Persistência

- **Engine Relacional:** **PostgreSQL**. Focado em integridade referencial rigorosa (ACID) para lidar com transações de pedidos e concorrência de estoque.
- **Acesso a Dados:** **Raw SQL** (Sem ORM). As consultas serão escritas diretamente em SQL puro utilizando as bibliotecas nativas/padrão do Go (como `database/sql`). Essa decisão arquitetural prioriza a performance bruta, controle absoluto sobre a otimização das _queries_ e evita a sobrecarga (overhead) e abstrações mágicas de ORMs tradicionais.

## 3. Gestão de Repositório e Infraestrutura (CI/CD)

O projeto coexistirá no mesmo repositório, porém sem o uso de ferramentas complexas de gerenciamento de monorepo (como Nx ou Turborepo).

- **Isolamento de Build:** Cada aplicação (Storefront, Backoffice e API) possui seu próprio processo e script de build de forma puramente independente.
- **Orquestração de Deploy:** O pipeline de CI/CD será gerenciado nativamente pelo **GitHub Actions**. As _actions_ atuarão como o cérebro da operação, identificando em qual diretório as alterações foram feitas para disparar o build e o deploy correspondente (ex: apenas fazer o deploy da API se houver alterações na pasta do back-end em Go).

## 4. Diagrama de Comunicação de Alto Nível (Contexto)

```text
[ Cliente Final ]         [ Administrador ]
       |                          |
       v                          v
+-------------+            +-------------+
| Storefront  |            | Backoffice  |
|  (Next.js)  |            | (React/Vite)|
+-------------+            +-------------+
       |                          |
       |     [ Nexus API ]        |
       +---> [ (Golang)  ] <------+
             [ /store    ]
             [ /admin    ]
                   |
                   v
            +-------------+
            | PostgreSQL  |
            | (Raw SQL)   |
            +-------------+
```
