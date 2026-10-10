# 📐 Plano de Execução Técnica: Server Action para Adicionar Item à Sacola

Este plano técnico foi simplificado para focar exclusivamente na criação da Server Action de **adicionar item na sacola** (`POST /api/store/cart/items`), **sem alterar páginas, layouts, `_app.tsx` ou `_document.tsx`**, mantendo o gerenciamento de sessão em `sessionStorage` e repassando o `sessionId` como argumento.

---

## 1. Visão Geral e Estratégia

- **Resumo da Entrega:**
  1. **Server Action `addToCartAction` (`src/shared/actions/cart.ts`):** Função com `'use server'` recebendo `{ sessionId, productId, quantity }` e chamando o backend Go via fetch server-side com `X-Session-ID`.
  2. **Hook `useAddToCart` (`src/shared/hooks/useCart.ts`):** Obtém `sessionId` do `sessionStorage` via `getOrCreateSessionId()` e invoca a `addToCartAction`.
  3. **Zero Impacto no Roteamento:** `src/pages/_app.tsx`, `src/pages/_document.tsx`, `src/pages/index.tsx` e estilos continuam intactos.
  4. **Testes Unitários:** Criação de testes para a action e atualização dos testes do hook.
- **Nível de Complexidade:** **Baixa / Direta**.
- **Quantidade de Contextos:** **1 Contexto**.

---

## 2. Checklist Técnico Global (`[ ]`)

- [x] **Server Action (`apps/frontend/storefront/src/shared/actions/`)**:
  - [x] Criar `src/shared/actions/cart.ts` com `'use server'`.
  - [x] Implementar `addToCartAction(payload: { sessionId: string; productId: string; quantity?: number }): Promise<Cart>`.
  - [x] Validar `sessionId` e `productId` obrigatórios.
  - [x] Disparar requisição para a rota `/api/store/cart/items` com cabeçalho `X-Session-ID`.
- [x] **Hook `useAddToCart` (`apps/frontend/storefront/src/shared/hooks/`)**:
  - [x] Atualizar `src/shared/hooks/useCart.ts` para conectar `addToCartAction` com `getOrCreateSessionId()`.
- [x] **Testes Automatizados Jest (`apps/frontend/storefront/`)**:
  - [x] Criar testes unitários em `src/shared/actions/__tests__/cart.test.ts`.
  - [x] Atualizar testes em `src/shared/hooks/__tests__/useCart.test.tsx`.
  - [x] Validar testes com `npm test`.
  - [x] Validar build com `npm run build`.

---

## 3. Prompt de Execução para o Agente (Ready-to-Run)

```markdown
### AGENTE ALVO: frontend-specialist

Você deve implementar a Server Action para adicionar item à sacola no Storefront (`apps/frontend/storefront`), de forma direta e sem mexer em nenhuma página, layout ou arquivos globais.

#### Diretrizes
- Diretório de trabalho: `apps/frontend/storefront/`.
- Proibido alterar `_app.tsx`, `_document.tsx`, `pages/` ou `session.ts`.
- Manter o `sessionStorage` intacto.

#### Passo a Passo
1. Criar `src/shared/actions/cart.ts`:
   ```typescript
   'use server'

   import {
     type Cart,
     type ApiCartResponse,
     mapApiCartToCart,
   } from '@/shared/services/cart'
   import type { ApiResponse } from '@/shared/services/catalog'

   export interface AddToCartActionPayload {
     sessionId: string
     productId: string
     quantity?: number
   }

   export async function addToCartAction(payload: AddToCartActionPayload): Promise<Cart> {
     const sessionId = payload?.sessionId?.trim()
     const productId = payload?.productId?.trim()
     const quantity = payload?.quantity ?? 1

     if (!sessionId) {
       throw new Error('Session ID is required to add an item to the cart')
     }

     if (!productId) {
       throw new Error('Product ID is required to add an item to the cart')
     }

     const baseUrl = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

     const response = await fetch(`${baseUrl}/api/store/cart/items`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'X-Session-ID': sessionId,
       },
       body: JSON.stringify({
         product_id: productId,
         quantity,
       }),
       cache: 'no-store',
     })

     const data: ApiResponse<ApiCartResponse> = await response.json()

     if (!response.ok || data?.success === false || !data?.data) {
       const errorMsg = data?.message || 'Falha ao adicionar item ao carrinho'
       throw new Error(errorMsg)
     }

     return mapApiCartToCart(data.data)
   }
   ```

2. Atualizar `src/shared/hooks/useCart.ts`:
   - Importar `addToCartAction` de `@/shared/actions/cart` e `getOrCreateSessionId` de `@/shared/utils/session`.
   - No `useAddToCart`, passar `sessionId: getOrCreateSessionId()` e os dados para `addToCartAction`.

3. Criar testes em `src/shared/actions/__tests__/cart.test.ts` e atualizar `src/shared/hooks/__tests__/useCart.test.tsx`.
4. Executar `npm test` e `npm run build`.
```
