---
name: naming-conventions
description: >-
  Estabelece convenções de nomenclatura declarativas e descritivas para variáveis, funções (verbos de ação) e booleanos (prefixos is/has/can/should), proibindo abreviações e nomes genéricos.
---

# Skill: Naming Conventions

Todo identificador deve ser **declarativo e descritivo**.

## Regras

- nomes devem explicar claramente a intenção
- evitar abreviações
- evitar nomes genéricos
- evitar nomes de uma letra

## Variáveis

Errado:

```javascript
const data
const value
const temp
```

Correto:

```javascript
const authenticatedUser
const requestPayload
const paymentAmount
```

## Funções

Funções devem indicar ação.

Errado:

```javascript
process()
handle()
```

Correto:

```javascript
validateUserInput()
calculateOrderTotal()
fetchUserProfile()
```

## Booleanos

Sempre iniciar com prefixos claros: `is`, `has`, `can`, `should`.

Exemplo:

```javascript
isUserAuthenticated
hasPermission
canAccessDashboard
```
