# 🛑 Regras e Restrições Globais (Anti-patterns)

Este documento define as regras estritas e os anti-patterns que **NÃO** devem ser praticados no desenvolvimento do Nexus Commerce. O descumprimento destas diretrizes caracteriza falha crítica de arquitetura.

## 🚫 1. Autonomia e Controle de Versão (Git)

- **Sem Commits/Pushes Autônomos:** Nunca execute `git commit` ou `git push` sem a revisão, confirmação e aprovação explícita do desenvolvedor humano.
- **Preservação do Histórico:** É terminantemente proibido executar comandos destrutivos de versionamento, como `git push --force`, `git reset --hard` ou `git rebase` em branches compartilhadas.

## 🗄️ 2. Banco de Dados e Infraestrutura

- **Proteção de Dados:** Nunca execute comandos como `DROP DATABASE` ou destrua os contêineres do Podman em execução sem autorização expressa.
- **Imutabilidade de Migrations:** É proibido modificar ou excluir arquivos SQL já existentes dentro da pasta `backend/migrations/`. Novas alterações devem ser feitas estritamente através de novos arquivos de migração.
- **Proibição de ORMs:** A comunicação com o PostgreSQL deve ser feita exclusivamente via Raw SQL utilizando `database/sql`. Não instale bibliotecas como GORM, Prisma ou TypeORM.

## 🏗️ 3. Arquitetura e Escopo

- **Respeito ao Vertical Slicing:** Nunca inicie o desenvolvimento de uma camada (Front, Back ou DB) de forma isolada. A funcionalidade deve cruzar as três camadas.
- **Isolamento de Escopos de API:** Nunca utilize endpoints de `/api/store` para resolver problemas administrativos do painel e vice-versa.
- **Sem Autenticação Precoce:** É estritamente proibido implementar fluxos de Login/Logout, sessões ou JWT durante a Release 1.
- **Isolamento de Dependências Frontend:** O `storefront/` usa apenas Next.js e TailwindCSS. O `backoffice/` usa React, Vite e Chakra UI. É proibido cruzar ou misturar essas dependências.

## 📝 4. Código e Nomenclatura

- **Idioma:** Proibido o uso de Português no código (nomes de tabelas, colunas SQL, variáveis, funções, rotas HTTP). Tudo deve ser escrito em Inglês.
- **Leitura Obrigatória:** É proibido propor soluções de arquitetura ou codificar sem antes ler as definições técnicas presentes nos manuais da pasta `skills/`.
