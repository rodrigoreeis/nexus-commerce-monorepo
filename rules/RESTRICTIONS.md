# 🛑 Regras e Restrições Globais (Anti-patterns)

Este documento define as regras estritas e os anti-patterns que **NÃO** devem ser praticados no desenvolvimento do Nexus Commerce. O descumprimento destas diretrizes caracteriza falha crítica de arquitetura.

## 🚫 1. Autonomia e Controle de Versão (Git)

- **Sem Commits/Pushes Autônomos:** Nunca execute `git commit` ou `git push` sem a revisão, confirmação e aprovação explícita do desenvolvedor humano.
- **Preservação do Histórico:** É terminantemente proibido executar comandos destrutivos de versionamento, como `git push --force`, `git reset --hard` ou `git rebase` em branches compartilhadas.

Todo desenvolvimento deve acontecer **localmente no repositório**. Nenhuma alteração deve ser enviada ao repositório remoto até que o trabalho seja concluído, revisado pelo usuário e explicitamente aprovado.

### Fluxo obrigatório

1. Implementar toda a funcionalidade localmente.
2. Criar ou modificar arquivos apenas no repositório local.
3. Executar validações locais quando aplicável (build, testes, lint e migrations).
4. Apresentar todas as alterações para revisão do usuário.
5. Aguardar aprovação explícita após o review.
6. Somente após a aprovação, criar e enviar a Pull Request.

### Restrições

- Nunca fazer `git push` automaticamente.
- Nunca abrir ou criar uma Pull Request sem aprovação explícita do usuário.
- Nunca mesclar (`merge`) alterações automaticamente.
- Em caso de dúvida, assumir que o trabalho deve permanecer apenas no ambiente local.

### Responsabilidade dos agentes

Todos os agentes devem considerar o repositório local como a única fonte de trabalho durante a implementação. O fluxo termina na preparação das alterações; a publicação no repositório remoto só acontece após a aprovação final do usuário.

## 🗄️ 2. Banco de Dados e Infraestrutura

- **Proteção de Dados:** Nunca execute comandos como `DROP DATABASE` ou destrua os contêineres do Podman em execução sem autorização expressa.
- **Imutabilidade de Migrations:** É proibido modificar ou excluir arquivos SQL já existentes dentro da pasta `backend/migrations/`. Novas alterações devem ser feitas estritamente através de novos arquivos de migração.
- **Proibição de ORMs:** A comunicação com o PostgreSQL deve ser feita exclusivamente via Raw SQL utilizando `database/sql`. Não instale bibliotecas como GORM, Prisma ou TypeORM.

## 🏗️ 3. Arquitetura e Escopo

- **Respeito ao Vertical Slicing:** Nunca inicie o desenvolvimento de uma camada (Front, Back ou DB) de forma isolada. A funcionalidade deve cruzar as três camadas.
- **Isolamento de Escopos de API:** Nunca utilize endpoints de `/api/store` para resolver problemas administrativos do painel e vice-versa.
- **Sem Autenticação Precoce:** É estritamente proibido implementar fluxos de Login/Logout, sessões ou JWT durante a Release 1.
- **Isolamento de Dependências Frontend:** O `storefront/` usa apenas Next.js e TailwindCSS. O `backoffice/` usa React, Vite e Chakra UI. É proibido cruzar ou misturar essas dependências.
- **Arquitetura de Pastas e SSR no Storefront (`pages/`, `shared/`):** O Storefront utiliza o **Next.js Pages Router** para simplificação e suporte nativo a `getServerSideProps`. A regra anterior de separação com pasta `domain/` e o uso de `HydrationBoundary`/`dehydrate` foram extintos em prol do padrão direto de **`initialData`**. A estrutura segue:
  - `src/pages/`: Rotas do Pages Router (`_app.tsx`, `_document.tsx`, `index.tsx`, etc.).
  - `src/shared/`: Componentes visuais reutilizáveis (`components/`), hooks customizados e React Query (`hooks/`), serviços/APIs (`services/`), utilitários (`utils/`) e tokens de tema (`theme/`).
  - **Separação Estrita de `hooks/` e `services/`:** É terminantemente proibido colocar React hooks (mesmo hooks de chamada do TanStack Query como `useQuery` e `useMutation`) dentro da pasta `services/`. A pasta `services/` é exclusiva para funções puras TypeScript com Axios e mapeamento de dados. Todos os hooks devem morar obrigatoriamente na pasta `src/shared/hooks/`.
  - **Padrão SSR Obrigatório com `initialData`:** É proibido carregar listagens públicas (catálogo de produtos, vitrines, categorias e PDP) puramente no lado do cliente via `useEffect` ou sem pré-carregamento SSR. A página em `src/pages/` deve obrigatoriamente buscar os dados no servidor em `getServerSideProps` e retorná-los em `props` (ex: `const posts = await getPosts(); return { props: { posts } }`). O componente da página consome o hook do TanStack Query (`src/shared/hooks/`) repassando `initialData: props.posts`, garantindo dados imediatos sem waterfalls nem necessidade de serialização com `dehydrate`.
- **Obrigatoriedade de API Collection no Bruno:** É proibido dar como concluído qualquer endpoint sem adicionar ou atualizar o respectivo request na coleção oficial do **Bruno** (`apps/backend/bruno/`). O Bruno é a ferramenta oficial de collection API do projeto (equivalente a Postman e Insomnia, mas versionada via Git). Toda rota criada ou alterada deve ter sua requisição correspondente criada/atualizada utilizando as skills de `skills/backend/bruno-collection-generator` e `skills/backend/bruno-test-writer`.

## 📝 4. Código e Nomenclatura

- **Idioma:** Proibido o uso de Português no código (nomes de tabelas, colunas SQL, variáveis, funções, rotas HTTP). Tudo deve ser escrito em Inglês.
- **Leitura Obrigatória:** É proibido propor soluções de arquitetura ou codificar sem antes ler as definições técnicas presentes nos manuais da pasta `skills/`.
