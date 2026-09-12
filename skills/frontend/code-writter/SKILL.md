---
name: code-writter
description: >-
  Define regras de escrita de código, exigindo idioma inglês em todo o código, ausência de comentários desnecessários em produção e uso obrigatório de JSDoc em funções utilitárias.
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

# Comment Rule

Comentários **não devem ser adicionados no código da aplicação**.

O código deve ser **autoexplicativo através de bons nomes de variáveis e funções**.

Exemplo correto:

```javascript
function calculateOrderTotal(items) {
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
export function calculateOrderTotal(items) {
  return items.reduce((total, item) => total + item.price, 0)
}
```

---

# Summary

Regras obrigatórias:

1. Todo código deve ser escrito **em inglês**.
2. Nunca utilizar português dentro do código.
3. Não adicionar comentários no código de produção.
4. Não adicionar comentários em testes unitários.
5. Utilizar **JSDoc em funções utilitárias**, especialmente nas pastas `utils`, `helpers` e `lib`.
6. Utilizar nomes claros e autoexplicativos para garantir legibilidade sem necessidade de comentários.
