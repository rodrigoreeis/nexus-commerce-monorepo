---
name: code-writter
description: >-
  Define regras de escrita de código, convenções de nomenclatura de arquivos (pastas de componentes em PascalCase com index.tsx, nunca replicar nome da pasta no arquivo, styles.module.css com @apply do Tailwind, camelCase para hooks, kebab-case exclusivo para rotas/páginas), idioma inglês e ausência de comentários desnecessários em produção.
---

# Skill: Code Writing Skill

Esta skill define regras obrigatórias para escrita de código dentro do projeto.

O objetivo é manter **consistência, padronização internacional e código limpo**.

---

# Language & Content Rules

1. **Código em Inglês**:
   Todo código interno **deve ser escrito em inglês**:
   * nomes de variáveis
   * nomes de funções
   * nomes de classes
   * nomes de arquivos
   * nomes de pastas
   * endpoints e rotas de API

   Nunca utilizar **português dentro dos identificadores de código**.

   Exemplo correto:
   ```javascript
   const userRepository = new UserRepository()
   ```

   Exemplo incorreto:
   ```javascript
   const repositorioUsuario = new RepositorioUsuario()
   ```

2. **Conteúdo de Interface do Usuário (UI) em Português**:
   * **Todo o conteúdo visual e textual voltado ao usuário final** (labels, botões, títulos de páginas, modais, mensagens de validação, estados vazios e de erro) **deve estar em Português do Brasil (pt-BR)**.
   * **Moeda Oficial do Produto: Reais (R$ / BRL)**:
     * Toda formatação monetária deve utilizar **Reais (R$)** via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` (ex: `R$ 199,99`).
     * Funções utilitárias como `formatStorePrice` e `formatCurrency` devem ter como padrão `currency: 'BRL'` e `locale: 'pt-BR'`.

---

# File & Component Naming Rules

Para manter consistência arquitetural e organização limpa:

1. **Componentes (`components/`)**:
   - Pastas de componentes utilizam **PascalCase** (ex: `components/Container/`, `components/ProductCard/`).
   - O arquivo principal do componente **DEVE SEMPRE ser chamado `index.tsx`** (ou `index.ts`).
   - **NUNCA replicar o nome do arquivo com o mesmo nome da pasta!**
     - ❌ **Errado:** `components/Container/Container.tsx`, `components/ProductCard/ProductCard.tsx`
     - ✅ **Correto:** `components/Container/index.tsx`, `components/ProductCard/index.tsx`
   - O arquivo de testes correspondente dentro da pasta do componente deve ser `__tests__/index.test.tsx`.

2. **Estilização com CSS Modules e Tailwind `@apply` (`styles.module.css`)**:
   - É proibido poluir o JSX/HTML diretamente com longas listas de classes utilitárias do Tailwind.
   - Todo componente estilizado com Tailwind deve utilizar **CSS Modules** concentrando as classes utilitárias via `@apply`.
   - O arquivo de estilos deve **obrigatoriamente ser chamado `styles.module.css`** e residir junto ao componente.
   - Exemplo:

   ```css
   /* components/Button/styles.module.css */
   .btnPrimary {
     @apply bg-blue-600 px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition;
   }
   ```

   ```tsx
   /* components/Button/index.tsx */
   import styles from './styles.module.css'

   export const Button = () => {
     return <button className={styles.btnPrimary}>Click Me</button>
   }
   ```

3. **Hooks (`hooks/`)**:
   - Arquivos de hooks devem utilizar **camelCase** sempre com o prefixo `use`.
   - Exemplos:
     - `hooks/useGetProducts.ts`
     - `hooks/useStoreProducts.ts`
     - `hooks/useAdminProducts.ts`

4. **Rotas e Páginas (`pages/`)**:
   - O uso de **kebab-case** é **exclusivo para rotas e páginas**.
   - Exemplos:
     - `pages/index.tsx`
     - `pages/products/index.tsx`
     - `pages/pagina-inicial.tsx`

5. **Serviços e Utilitários (`services/`, `utils/`)**:
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
3. Componentes usam pasta **PascalCase** com arquivo **`index.tsx`** e **`styles.module.css`**.
4. **Nunca replicar o nome do arquivo com o mesmo nome da pasta** (proibido `Container/Container.tsx`).
5. Usar **CSS Modules com `@apply` do Tailwind** em vez de classes diretas no JSX/HTML.
6. Hooks usam **camelCase** com prefixo `use` (`hooks/useGetProducts.ts`).
7. Kebab-case é **exclusivo para rotas e páginas** (`pages/pagina-inicial.tsx`).
8. Não adicionar comentários no código de produção ou testes.
9. Utilizar **JSDoc em funções utilitárias** (`utils/`).
10. Utilizar nomes claros e autoexplicativos para garantir legibilidade sem necessidade de comentários.
