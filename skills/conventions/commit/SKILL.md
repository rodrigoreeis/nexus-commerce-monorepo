---
name: commit
description: >-
  Padroniza a geração de mensagens de commit no projeto seguindo estritamente a convenção Angular Conventional Commits, garantindo histórico legível e estruturado para changelog.
---

# Skill: Angular Conventional Commit Messages

Responsável por gerar mensagens de commit seguindo **estritamente** o padrão **Angular Conventional Commits**.  
Sempre que alterações forem feitas no projeto, **um commit deve ser criado seguindo exatamente essas regras**.

O objetivo é manter um **histórico de commits legível, padronizado e analisável para geração automática de changelog**.

---

# Estrutura obrigatória

Todo commit deve seguir a seguinte estrutura:

```
<header>

<body>

<footer>
```

Regras:

* **Header é obrigatório**
* **Body é obrigatório**, exceto para commits do tipo `docs`
* **Footer é opcional**
* Sempre respeitar linhas em branco entre as seções

---

# Commit Header

Formato obrigatório:

```
<type>(<scope>): <summary>
```

Exemplo:

```
feat(router): add support for nested navigation guards
```

Estrutura:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─ resumo no presente, imperativo, sem ponto final
  │       │
  │       └─ escopo da mudança
  │
  └─ tipo do commit
```

---

# Type (obrigatório)

Use apenas os tipos abaixo:

| Type     | Descrição                                                       |
| -------- | --------------------------------------------------------------- |
| build    | mudanças que afetam o sistema de build ou dependências externas |
| ci       | mudanças em configuração ou scripts de CI                       |
| docs     | mudanças apenas em documentação                                 |
| feat     | nova funcionalidade                                             |
| fix      | correção de bug                                                 |
| perf     | melhoria de performance                                         |
| refactor | refatoração sem alterar comportamento                           |
| test     | adicionar ou corrigir testes                                    |

Exemplos:

```
feat(router): add lazy loading support
fix(http): prevent duplicate headers
perf(core): optimize dependency injection
```

---

# Scope (opcional)

O **scope** deve indicar qual módulo ou área do projeto foi afetada.

Scopes suportados:

```
animations
benchpress
common
compiler
compiler-cli
core
dev-infra
devtools
docs-infra
elements
forms
http
language-service
language-server
localize
migrations
platform-browser
platform-browser-dynamic
platform-server
router
service-worker
upgrade
vscode-extension
zone.js
```

Exemplos:

```
feat(forms): add async validation support
fix(router): resolve navigation guard race condition
refactor(core): simplify dependency injection logic
```

Quando a mudança afeta múltiplos módulos:

```
test: add missing unit tests
```

Para documentação geral:

```
docs: fix typo in tutorial
```

---

# Summary (obrigatório)

O campo summary deve:

* usar **tempo presente**
* usar **imperativo**
* **não capitalizar a primeira letra**
* **não terminar com ponto**

Exemplos corretos:

```
feat(router): add lazy loading support
fix(http): prevent duplicate request headers
```

Exemplos incorretos:

```
feat(router): Added lazy loading support.
fix(http): Fix duplicate headers.
```

---

# Commit Body

O body deve explicar **o motivo da mudança**.

Regras:

* usar **tempo presente**
* usar **imperativo**
* explicar **por que a mudança foi feita**
* explicar **impacto da mudança**
* ter **mínimo de 20 caracteres**

Exemplo:

```
feat(router): add lazy loading support

allow modules to be loaded only when the route is accessed.
this reduces the initial bundle size and improves application startup time.
```

---

# Commit Footer (opcional)

O footer pode conter:

* **breaking changes**
* **deprecations**
* **referência a issues ou PRs**

---

# Breaking Changes

Formato obrigatório:

```
BREAKING CHANGE: <resumo>

<descrição detalhada + instruções de migração>
```

Exemplo:

```
BREAKING CHANGE: remove legacy http module

the legacy http module has been removed.
applications must migrate to the new http client module.
```

---

# Deprecated

Formato:

```
DEPRECATED: <item deprecated>

<descrição + caminho de migração recomendado>
```

Exemplo:

```
DEPRECATED: legacy authentication module

this module will be removed in the next major version.
use the new auth provider system instead.
```

---

# Referência a Issues ou PRs

Use no footer:

```
Fixes #123
Closes #456
```

Exemplo:

```
Closes #245
```

---

# Revert Commits

Quando um commit reverte outro commit:

Header:

```
revert: <header do commit original>
```

Body obrigatório:

```
This reverts commit <SHA>.

<explicação clara do motivo da reversão>
```

Exemplo:

```
revert: feat(router): add lazy loading support

This reverts commit 8f3c1a2.

the feature introduced a regression in route guards.
```

---

# Regras obrigatórias

O agente deve sempre:

1. **seguir exatamente o padrão Angular Conventional Commits**
2. **nunca criar commits fora desse padrão**
3. **gerar commits claros e objetivos**
4. **preferir commits pequenos e focados**
5. **explicar a motivação da mudança no body**
6. **garantir que o body tenha no mínimo 20 caracteres**
7. **garantir que o summary siga todas as regras de formatação**

---

# Exemplo completo de commit

```
feat(router): add support for route preloading

allow routes to preload modules in the background
after the application bootstrap. this improves
navigation speed for large applications.

Closes #245
```
