---
name: cleancode
description: >-
  Aplica princípios de Clean Code ao desenvolvimento de software, garantindo código legível, autoexplicativo, sem duplicações e com funções e variáveis descritivas.
---

# Skill: Clean Code

Todo código deve seguir princípios de Clean Code.

## Regras obrigatórias

- escrever código **legível antes de otimizado**
- priorizar **clareza sobre cleverness**
- evitar duplicação (DRY)
- evitar funções muito grandes
- evitar comentários que expliquem código ruim

## Funções

- máximo recomendado: **30 linhas**
- funções devem ter **uma única responsabilidade**
- nomes devem ser **claros e autoexplicativos**

Exemplo correto:

function calculateCartTotal(cartItems)

Exemplo errado:

function calc(data)

## Variáveis

Sempre usar **nomes declarativos**.

Errado:

const x
const tmp
const data

Correto:

const userEmail
const orderTotal
const validatedInput

## Boas práticas

- código deve ser legível sem precisar de comentários
- remover código morto
- evitar lógica duplicada
- evitar condicionais complexas
