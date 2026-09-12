---
name: validation-pattern
description: >-
  Padroniza a extração de validações de condicionais complexas para variáveis booleanas declarativas, aumentando a legibilidade e facilidade de depuração.
---

# Skill: Validation Pattern

Validações **nunca devem ser escritas diretamente dentro de condicionais complexas**.

Sempre extrair validações para **variáveis declarativas**.

## Regra obrigatória

Nunca fazer:

```javascript
if (user && user.email && user.email.includes("@"))
```

Sempre fazer:

```javascript
const hasUser = Boolean(user)
const hasEmail = Boolean(user?.email)
const hasValidEmail = user?.email?.includes("@")

if (hasUser && hasEmail && hasValidEmail)
```

## Objetivo

- aumentar legibilidade
- facilitar debugging
- permitir logs intermediários
- melhorar manutenção
