---
name: simplicity-and-structural-conventions
description: >-
  Define convenções estruturais do projeto: preferência por funções sobre classes, uso de arrow functions, optional chaining (?.), early returns e nomenclatura em kebab-case para arquivos e pastas.
---

# Skill: Simplicidade de Código e Convenções de Estrutura

O código deve sempre priorizar **simplicidade, previsibilidade e segurança**.  
Evite abstrações desnecessárias e escolha sempre a solução **mais simples possível**.

---

## Princípio principal

Sempre seguir a regra:

**prefira a solução mais simples que resolve o problema**

Evitar:

- abstrações prematuras
- arquiteturas desnecessariamente complexas
- uso excessivo de classes
- padrões que não agregam valor real

---

## Uso de Classes

Classes **não devem ser criadas por padrão**.

Use classes **somente quando realmente necessário**, por exemplo:

- quando há **estado compartilhado**
- quando o domínio exige **modelagem orientada a objeto**
- quando existe **herança ou polimorfismo real**

### Preferir

- funções puras
- módulos simples
- objetos literais

Exemplo preferido:

```js
const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => total + item.price, 0)
}
```

Evitar:

```js
class OrderService {
  calculateOrderTotal(orderItems) {
    // TODO: implement
  }
}
```

---

## Uso de Constructor

Quando uma classe for realmente necessária:

* **evitar uso de constructor sempre que possível**
* preferir **funções estáticas ou métodos simples**

Evitar:

```js
class UserService {
  constructor(repository) {
    this.repository = repository
  }
}
```

Preferir:

```js
class UserService {
  static createUser(data) {
    // TODO: implement
  }
}
```

---

## Optional Chaining

Sempre utilizar **optional chaining (`?.`)** ao acessar propriedades de objetos que possam ser indefinidas.

Objetivo:

* evitar erros de runtime
* tornar o código mais seguro

Errado:

```js
user.profile.email
```

Correto:

```js
user?.profile?.email
```

---

## Destructuring de Objetos

Evitar **object destructuring** quando os dados não forem **100% confiáveis**.

Errado:

```js
const { email } = user
```

Correto:

```js
const userEmail = user?.email
```

Destructuring só deve ser utilizado quando:

* a estrutura do objeto é **totalmente garantida**
* o objeto vem de **fonte controlada**

Exemplo permitido:

```js
const { id, name } = validatedUser
```

---

## Convenções de Nomeação

### Pastas

Pastas devem sempre usar **kebab-case**.

Exemplo:

```
user-service
payment-gateway
auth-controller
order-repository
```

---

### Arquivos

Arquivos também devem seguir **kebab-case**.

Exemplo:

```
user-service.js
payment-validator.js
auth-middleware.js
```

---

## Estilo de Funções

Todas as funções devem seguir um **padrão consistente baseado em arrow functions**.

O objetivo é manter:

- consistência no código
- sintaxe moderna
- evitar problemas com binding de `this`
- facilitar leitura e manutenção

---

## Regra obrigatória

Sempre utilizar **arrow functions** ao invés de funções declarativas tradicionais.

Correto:

```js
const calculateOrderTotal = (orderItems) => {
  return orderItems.reduce((total, item) => total + item.price, 0)
}
```

Errado:

```js
function calculateOrderTotal(orderItems) {
  return orderItems.reduce((total, item) => total + item.price, 0)
}
```

---

## Arrow Functions Curtas

Quando possível, utilizar **retorno implícito** para funções simples.

Correto:

```js
const sum = (a, b) => a + b
```

Outro exemplo:

```js
const isUserAuthenticated = (user) => Boolean(user?.token)
```

---

## Parâmetros

Quando a função possuir muitos parâmetros, preferir **passar um objeto**.

Evitar:

```js
const createUser = (name, email, age, role) => {
  // TODO: implement
}
```

Preferir:

```js
const createUser = ({
  name,
  email,
  age,
  role
}) => {
  // TODO: implement
}
```

---

## Funções Pequenas

Funções devem ser:

* pequenas
* focadas
* com **uma única responsabilidade**

Evitar funções grandes e com múltiplas responsabilidades.

---

## Evitar Nested Logic

Preferir **early return** para reduzir complexidade.

Evitar:

```js
const processUser = (user) => {
  if (user) {
    if (user.isActive) {
      return user.name
    }
  }
}
```

Preferir:

```js
const processUser = (user) => {
  if (!user) return
  if (!user.isActive) return

  return user.name
}
```

---

## Quando evitar Arrow Functions

Arrow functions devem ser o padrão do projeto.

Evitar apenas quando houver necessidade explícita de:

* binding dinâmico de `this`
* métodos de protótipo
* constructors (quando classes forem inevitáveis)

Fora desses casos, **arrow functions são obrigatórias no projeto**.

---

### Classes

Classes devem usar **PascalCase**.

Exemplo:

```js
UserService
PaymentGateway
AuthController
```

---

### Constantes Estáticas

Constantes globais ou estáticas devem usar **SCREAMING_SNAKE_CASE**.

Exemplo:

```js
USER_TOKEN_EXPIRED_TIME = 30
MAX_LOGIN_ATTEMPTS = 5
DEFAULT_PAGE_SIZE = 20
REQUEST_TIMEOUT_SECONDS = 10
```

---

## Regras Gerais

Sempre:

* priorizar código simples
* evitar abstrações desnecessárias
* evitar classes quando funções resolvem
* usar optional chaining em acessos de objeto
* evitar destructuring de objetos não confiáveis
* seguir estritamente as convenções de naming

---

## Mentalidade

Antes de escrever código, sempre perguntar:

* isso pode ser feito com uma função simples?
* essa classe é realmente necessária?
* existe uma forma mais simples de resolver?
