---
name: react
description: Esta skill estabelece os padrões modernos de engenharia front-end orientados ao **React 19**. O foco é eliminar boilerplate de ciclo de vida, erradicar micromanagement de memoização manual e priorizar o ecossistema assíncrono nativo (Actions, Transitions e Server Components).
---

# Skill:

## Visão Geral & Filosofia

## 1. Guia de Substituição: "Use X em vez de Y"

| Use Isto (React 19)                             | Em Vez Disto (React 18 e Legados)                           | Motivo / Vantagem                                                                                 |
| :---------------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `ref` direto como prop                          | `forwardRef((props, ref) => ...)`                           | `forwardRef` foi depreciado. `ref` agora é uma prop de primeira classe em componentes funcionais. |
| `<Context>`                                     | `<Context.Provider>`                                        | Menor verbosidade sintática; `Context` atua diretamente como o próprio provider.                  |
| `useActionState`                                | `useState` + `setIsLoading` + `setError` manuais em submits | Gerencia ciclo completo de ações assíncronas (estado, pending, retorno e erro) automaticamente.   |
| `useFormStatus`                                 | Prop drilling de `isSubmitting` / `disabled`                | Componentes filhos acessam diretamente o status do `<form>` pai sem passar props adicionais.      |
| `useOptimistic`                                 | `useState` com reversão manual de rollback em falhas        | Rollback declarativo e automático de interface otimista vinculado a transições.                   |
| `use(Promise)` / `use(Context)`                 | `useEffect` + `useState` para fetch inicial / `useContext`  | Lê recursos assíncronos e contextos condicionalmente dentro do fluxo de render com `Suspense`.    |
| React Compiler (código limpo)                   | `useMemo`, `useCallback`, `React.memo` defensivos           | O compilador memoriza dependências e reconciliação em build time.                                 |
| Elementos nativos `<title>`, `<meta>`, `<link>` | `react-helmet`, `react-helmet-async`                        | O React 19 faz hoisting automático de tags de metadados para o `<head>` do documento.             |
| Cleanup em `ref` callbacks (`return () => ...`) | Lógica de cleanup separada via `useEffect`                  | Callbacks de `ref` agora suportam retorno de função de descarte executada na desmontagem.         |

---

## 2. Padrões de Código & Novas Funcionalidades

### 2.1. Forms & Assincronismo com `useActionState` e `useFormStatus`

Elimine handlers manuais com flags de loading e gerenciamento manual de formulários.

```tsx
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

// 1. Botão desacoplado que consome o status do form pai
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}

// 2. Componente principal com Action State
export function UserProfileForm({
  updateUserAction,
}: {
  updateUserAction: (prevState: any, formData: FormData) => Promise<any>;
}) {
  const [state, formAction, isPending] = useActionState(updateUserAction, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="space-y-4">
      <input name="name" type="text" required placeholder="Nome completo" />

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-green-500">Atualizado com sucesso!</p>
      )}

      <SubmitButton />
    </form>
  );
}
```

---

### 2.2. Interface Otimista com `useOptimistic`

Atualize a UI instantaneamente enquanto a mutação ocorre em background, garantindo rollback transparente se a Promise rejeitar.

```tsx
import { useOptimistic } from "react";

interface Message {
  id: string;
  text: string;
  sending?: boolean;
}

export function ChatList({
  messages,
  sendMessageAction,
}: {
  messages: Message[];
  sendMessageAction: (formData: FormData) => Promise<void>;
}) {
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (state, newMessageText: string) => [
      ...state,
      { id: crypto.randomUUID(), text: newMessageText, sending: true },
    ],
  );

  async function handleAction(formData: FormData) {
    const text = formData.get("message") as string;
    setOptimisticMessages(text);
    await sendMessageAction(formData);
  }

  return (
    <div>
      <ul>
        {optimisticMessages.map((msg) => (
          <li
            key={msg.id}
            className={msg.sending ? "opacity-50" : "opacity-100"}
          >
            {msg.text} {msg.sending && "(Enviando...)"}
          </li>
        ))}
      </ul>
      <form action={handleAction}>
        <input name="message" type="text" required />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

---

### 2.3. Resolução de Recursos com a API `use()`

Diferente dos hooks tradicionais, `use()` pode ser executado dentro de condicionais e loops. Quando passado com uma Promise, integra-se nativamente com boundaries de `<Suspense>`.

```tsx
import { use, Suspense, createContext } from "react";

const ThemeContext = createContext<{ theme: string }>({ theme: "light" });

// Leitura condicional de Context sem quebrar as regras de hooks
function Header({ shouldApplyTheme }: { shouldApplyTheme: boolean }) {
  if (!shouldApplyTheme) {
    return <header>Layout Padrão</header>;
  }

  const { theme } = use(ThemeContext);
  return <header className={theme}>Layout Customizado: {theme}</header>;
}

// Resolução de Promise com Suspense
function Comments({ commentsPromise }: { commentsPromise: Promise<string[]> }) {
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  );
}
```

---

### 2.4. `ref` como Prop Nativa e Simplificação de Contexto

```tsx
import { createContext, type ComponentPropsWithRef } from 'react';

// Contexto simplificado: dispensa .Provider
const AuthContext = createContext<{ user: string | null }>(null);

export function AuthProvider({ children, user }: { children: React.ReactNode; user: string | null }) {
  return <AuthContext user value="{{" }}>{children}</AuthContext>;
}

// Componente recebendo ref diretamente via props (sem forwardRef)
interface CustomInputProps extends ComponentPropsWithRef<'input'> {
  label: string;
}

export function CustomInput({ label, ref, ...props }: CustomInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span>{label}</span>
      <input ref={ref} {...props} />
    </label>
  );
}

```

---

### 2.5. Suporte Nativo a Document Metadata e Assets

Metadados, folhas de estilo e scripts assíncronos podem ser declarados no próprio componente e recebem hoisting automático para a tag `<head>`.

```tsx
export function BlogPost({
  post,
}: {
  post: { title: string; summary: string };
}) {
  return (
    <article>
      {/* React 19 faz o hoisting automático para o <head> */}
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      <link rel="stylesheet" href="/styles/blog-post.css" precedence="high" />

      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </article>
  );
}
```

## 3. Diretrizes de Qualidade para o Agente

1. **Memoização:** Nunca adicione `useMemo` ou `useCallback` por padrão a menos que esteja lidando com refs estáveis exigidos por libs externas sem suporte ao React Compiler. Escreva código JavaScript/TypeScript direto e idiomático.
2. **Mutação de Dados:** Isole fluxos de mutação via Actions (`useActionState`, `useTransition`, `form action`), nunca utilizando eventos `onSubmit` com chamadas imperativas de `e.preventDefault()` e `try/catch` inflados com múltiplos setters de estado.
3. **Erros de Hidratação:** O React 19 traz diffing visual detalhado no console para disparidades entre Server e Client. Não suprima erros com `suppressHydrationWarning` sem antes verificar as inconsistências no diff de renderização.
