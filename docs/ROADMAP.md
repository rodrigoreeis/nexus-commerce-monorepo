# Projeto: Nexus Commerce

**Contexto:** Trabalho acadêmico com foco na aplicação prática do Manifesto Ágil (entregas em fatias verticais) e Engenharia de Software.

## 🎯 Visão Geral

O Nexus Commerce é uma plataforma de e-commerce construída sob uma arquitetura API-First (Monólito Modular). O objetivo principal é garantir entregas contínuas de software funcional, integrando a operação da loja (Backoffice) com a vitrine pública (Storefront) através de um back-end centralizado.

## 🏗️ Arquitetura do Sistema

O sistema adota uma estrutura de múltiplos clientes consumindo uma API central:

- **Storefront (Front-end):** Vitrine pública focada na experiência do consumidor final.
- **Backoffice (Front-end):** Painel administrativo para gestão de catálogo e pedidos.
- **Nexus API (Back-end Único):** API central que gerencia todo o domínio da aplicação. Deve possuir separação lógica de rotas (namespaces):
  - `/api/store/...` para consumo do Storefront.
  - `/api/admin/...` para consumo do Backoffice.
- **Banco de Dados:** Banco relacional único gerenciado pela Nexus API.

## ⚠️ Regras e Restrições Globais (Crucial para Agentes de IA)

1. **Vertical Slicing:** Nenhuma camada (Front, Back ou DB) deve ser desenvolvida isoladamente. Toda funcionalidade deve cruzar as três camadas.
2. **Restrição da Release 1:** É ESTRITAMENTE PROIBIDO implementar qualquer mecanismo de autenticação (Login/Logout, JWT, Sessions) na primeira entrega.
3. **Padrões de Código:** Manter a separação clara de responsabilidades lógicas dentro da API (Controllers/Services distintos para Admin e Store), mesmo compartilhando o mesmo projeto e banco de dados.

---

## 🗺️ Roadmap de Entregas (Releases)

### Release 1: Catálogo Digital Mínimo Viável (MVP)

**Objetivo Arquitetural:** Validar a integração ponta a ponta (end-to-end) sem barreiras de autenticação.

- **DB/API:** Modelagem do banco; criação da tabela `Produtos`; endpoints na Nexus API para criação (`/api/admin/produtos`) e listagem pública (`/api/store/produtos`).
- **Backoffice:** Interface para inserção de dados (formulário de novo produto) e listagem interna.
- **Storefront:** Exibição da grade de produtos em tempo real.

### Release 2: Jornada de Compra (Carrinho Anônimo)

**Objetivo Arquitetural:** Introduzir interatividade no client-side e gestão de estado temporário.

- **DB/API:** Criação de tabelas de `Carrinhos` e `Itens_Carrinho` atreladas a um ID de sessão de navegação; endpoints em `/api/store/carrinho` para adicionar, remover e calcular subtotal.
- **Storefront:** Detalhes do produto; drawer/página de carrinho com cálculo dinâmico de valores.

### Release 3: Gestão de Identidade e Controle de Acesso (RBAC)

**Objetivo Arquitetural:** Fechar o perímetro de segurança implementando autenticação e separação de perfis na API.

- **DB/API:** Tabela de `Usuarios` com coluna de papel (`role`: admin/cliente); geração e validação de tokens JWT. Inclusão de _middlewares_ de autorização para bloquear as rotas `/api/admin/*`. Regra para vincular carrinho anônimo ao usuário recém-logado.
- **Backoffice:** Tela de Login; proteção das rotas privadas no client-side.
- **Storefront:** Tela de Login/Cadastro para o cliente final.

### Release 4: Orquestração de Pedidos e Documentação

**Objetivo Arquitetural:** Finalizar o ciclo de vida da transação e gerar artefatos formais.

- **DB/API:** Tabelas `Pedidos` e `Itens_Pedido`; conversão de carrinho em pedido; rotas para listagem (cliente vs. admin) e atualização de status logístico.
- **Storefront:** Tela de checkout e área "Meus Pedidos".
- **Backoffice:** Painel de gestão para atualização do status de entrega.
- **Artefatos:** Geração dos Diagramas de Entidade-Relacionamento (DER), Classes e Arquitetura.
