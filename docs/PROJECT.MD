# 🗺️ Roadmap do Projeto: Nexus Commerce

Este documento descreve as etapas de desenvolvimento do Nexus Commerce, divididas em 4 entregas (releases) focadas em fatias verticais (Vertical Slicing), seguindo os princípios do Manifesto Ágil.

## 📦 Release 1: Catálogo Digital Mínimo Viável (MVP)

**Objetivo:** Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

- [ ] **DB/API:** Modelagem inicial do banco de dados relacional.
- [ ] **DB/API:** Criação da tabela `Produtos`.
- [ ] **API:** Endpoint `/api/admin/produtos` (POST) para inserção de dados.
- [ ] **API:** Endpoint `/api/store/produtos` (GET) para listagem pública.
- [ ] **Backoffice:** Construção do layout base e formulário de cadastro de produtos.
- [ ] **Backoffice:** Tela de listagem interna do catálogo.
- [ ] **Storefront:** Construção da vitrine pública consumindo a API para exibir a grade de produtos.

## 🛒 Release 2: Jornada de Compra

**Objetivo:** Introduzir interatividade no client-side e gestão de estado temporário no back-end.

- [ ] **DB/API:** Criação das tabelas `Carrinhos` (por Session ID) e `Itens_Carrinho`.
- [ ] **API:** Endpoints `/api/store/carrinho` para adicionar, remover e atualizar quantidade de itens.
- [ ] **API:** Lógica de cálculo dinâmico de subtotal.
- [ ] **Storefront:** Implementação da página de detalhes do produto.
- [ ] **Storefront:** Construção da interface do carrinho (drawer ou página dedicada) integrada à API.

## 🔐 Release 3: Gestão de Identidade e Controle de Acesso (RBAC)

**Objetivo:** Implementar o perímetro de segurança, isolamento de papéis (Admin vs Cliente) e autenticação.

- [ ] **DB/API:** Criação da tabela `Usuarios` (com distinção de papel/role).
- [ ] **API:** Lógica de geração e validação de tokens JWT.
- [ ] **API:** Implementação de middlewares de segurança bloqueando rotas `/api/admin/*`.
- [ ] **API:** Lógica para vincular o carrinho anônimo existente ao perfil do usuário recém-logado.
- [ ] **Backoffice:** Implementação de tela de Login e proteção das rotas privadas no front-end.
- [ ] **Storefront:** Criação do fluxo de Login e Cadastro para clientes finais.

## 🚚 Release 4: Orquestração de Pedidos e Entregáveis Acadêmicos

**Objetivo:** Finalizar o ciclo de vida da transação e consolidar a documentação arquitetural.

- [ ] **DB/API:** Criação das tabelas `Pedidos` e `Itens_Pedido`.
- [ ] **API:** Endpoint de checkout (conversão de carrinho ativo para pedido definitivo).
- [ ] **API:** Endpoints para listagem de pedidos (histórico do cliente vs listagem geral do admin).
- [ ] **API:** Endpoint para atualização de status logístico do pedido.
- [ ] **Storefront:** Construção da tela de Checkout final e área "Meus Pedidos".
- [ ] **Backoffice:** Painel de gestão de logística para alteração de status.
- [ ] **Engenharia:** Elaboração do Diagrama de Entidade-Relacionamento (DER).
- [ ] **Engenharia:** Elaboração do Diagrama de Classes.
- [ ] **Engenharia:** Elaboração do Diagrama de Arquitetura.
