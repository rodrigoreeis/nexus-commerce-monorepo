---
name: code-writter
description: >-
  Define regras de escrita de código, convenções de nomenclatura de arquivos (PascalCase para componentes, camelCase para hooks, kebab-case exclusivo para rotas/páginas), idioma inglês e ausência de comentários desnecessários em produção.
---

# Skill: Code Writing Skill

Esta skill define regras obrigatórias para escrita de código dentro do projeto.

O objetivo é manter **consistência, padronização internacional e código limpo**.

---

# Language Rule

Todo código **deve ser escrito em inglês**.

Isso inclui:

* nomes de variáveis
* nomes de funções
* nomes de classes
* nomes de arquivos
* nomes de pastas
* mensagens de erro
* textos retornados por APIs

Nunca utilizar **português dentro do código**.

Exemplo correto:

```javascript
const userRepository = new UserRepository()
```

Exemplo incorreto:

```javascript
const repositorioUsuario = new RepositorioUsuario()
```

---

# File & Component Naming Rules

Para manter consistência arquitetural e facilidade de importação:

1. **Componentes (`components/`)**:
   - Pastas e arquivos de componentes devem utilizar **PascalCase**.
   - Exemplos:
     - `components/Container/Container.tsx`
     - `components/ProductCard/ProductCard.tsx`
     - `components/ProductGrid/ProductGrid.tsx`
     - `components/Header/Header.tsx`
     - `components/Layout/Layout.tsx`

2. **Hooks (`hooks/`)**:
   - Arquivos de hooks devem utilizar **camelCase** sempre com o prefixo `use`.
   - Exemplos:
     - `hooks/useGetProducts.ts`
     - `hooks/useStoreProducts.ts`
     - `hooks/useAdminProducts.ts`

3. **Rotas e Páginas (`pages/`)**:
   - O uso de **kebab-case** é **exclusivo para rotas e páginas**.
   - Exemplos:
     - `pages/index.tsx`
     - `pages/products/index.tsx`
     - `pages/pagina-inicial.tsx`

4. **Serviços e Utilitários (`services/`, `utils/`)**:
   - Arquivos utilizam **camelCase**.
   - Exemplos:
     - `services/catalog.ts`
     - `services/products.ts`
     - `utils/format.ts`

---

# Comment Rule

Comentários **não devem ser adicionados no código da aplicação**.

O código deve ser **autoexplicativo através de bons nomes de variáveis e funções**.

Exemplo correto:

```javascript
const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + item.price, 0)
}
```

---

# JSDoc Rule

Funções utilitárias devem possuir **documentação em JSDoc**.

Isso se aplica principalmente a funções dentro das pastas:

* `utils`
* `helpers`
* `lib`

Objetivo:

* documentar comportamento
* documentar parâmetros
* documentar retorno da função

Exemplo:

```javascript
/**
 * Calculates the total value of an order based on its items.
 *
 * @param {Array} items - List of order items.
 * @returns {number} Total price of the order.
 */
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + item.price, 0)
}
```

---

# Summary

Regras obrigatórias:

1. Todo código deve ser escrito **em inglês**.
2. Nunca utilizar português dentro do código.
3. Componentes usam **PascalCase** (`components/Container/Container.tsx`, `components/ProductCard/ProductCard.tsx`).
4. Hooks usam **camelCase** com prefixo `use` (`hooks/useGetProducts.ts`).
5. Kebab-case é **exclusivo para rotas e páginas** (`pages/pagina-inicial`).
6. Não adicionar comentários no código de produção ou testes.
7. Utilizar **JSDoc em funções utilitárias** (`utils/`).
8. Utilizar nomes claros e autoexplicativos para garantir legibilidade sem necessidade de comentários.
