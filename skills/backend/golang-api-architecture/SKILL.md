---
name: golang-api-architecture
description: >-
  Diretrizes de arquitetura de pastas e módulos para APIs REST em Golang no Nexus Commerce. Use esta skill sempre que for criar, organizar ou refatorar a estrutura de pastas e camadas de um serviço backend em Go.
---

# Golang API Architecture & Package Structure

Esta skill define a arquitetura padrão para desenvolvimento de APIs REST em **Golang** no Nexus Commerce, adotando uma estrutura pragmática, limpa e modular.

## 1. Visão Geral da Arquitetura

A arquitetura adota uma divisão clara de responsabilidades em camadas desacopladas:

```text
.
├── bruno/                   # Coleção oficial de API do Bruno versionada no Git
│   ├── bruno.json           # Configuração raiz da coleção Bruno
│   ├── environments/        # Ambientes de execução (ex: Local.bru com baseUrl)
│   ├── health/              # Requisições de health check
│   ├── store/               # Requisições públicas da Storefront (/api/store)
│   └── admin/               # Requisições administrativas do Backoffice (/api/admin)
├── cmd/
│   └── api.go               # Inicialização do servidor Gin, injeção de dependências e registro de rotas
├── config/
│   └── envoriments.go       # Carregamento de configurações (TOML/ENV)
├── migrations/
│   └── 01-*.sql             # Scripts de migração SQL versionados
├── postgres/
│   ├── connection.go        # Inicialização do pool de conexões com PostgreSQL
│   ├── store.go             # Interface Storage e struct Store central
│   └── <entity>.go          # Implementação das queries de banco por entidade (ex: users.go)
├── routers/
│   └── routers.go           # Mapeamento e registro das rotas HTTP no router Gin
├── service/
│   ├── service.go           # Struct Service central, helpers de resposta JSON e logs (slog)
│   └── <entity>.go          # Regras de negócio e handlers HTTP por entidade (ex: users.go)
├── utils/
│   └── crypto.go            # Funções utilitárias (hash de senha, JWT, utilitários)
├── config.toml              # Arquivo de configuração de ambiente
├── Makefile                 # Automação de builds e execução
└── main.go                  # Ponto de entrada da aplicação
```

## 2. Responsabilidades das Camadas

### A. Coleções de API & Documentação (`bruno/`)
- **Bruno** é a ferramenta oficial de API Collection do projeto (equivalente a Postman e Insomnia, mas versionado via Git em arquivos de texto plano).
- Toda nova rota ou modificação de endpoint na API Go DEVE ter sua requisição correspondente criada/atualizada em `apps/backend/bruno/`.
- As requisições são organizadas por domínio (`health/`, `store/`, `admin/`) e utilizam variáveis de ambiente (`{{baseUrl}}`).
- Cada requisição inclui headers, payload de exemplo, documentação (`docs`) e asserções (`assert`) para validação automatizada.

### B. Ponto de Entrada (`main.go`)
- Carrega as variáveis de ambiente (`config.LoadConfigEnv`).
- Abre a conexão com o banco de dados (`postgres.NewDBConnection`).
- Instancia o servidor API (`cmd.NewAPIServer`).
- Executa a aplicação (`api.Run()`).

### C. Servidor API (`cmd/api.go`)
- Instancia o engine do **Gin** (`gin.Default()`).
- Instancia a camada de armazenamento (`postgres.NewStore`).
- Instancia a camada de serviço (`service.NewService`).
- Registra as rotas via `routers.Register(*newService, r)`.
- Inicia o servidor HTTP escutando a porta configurada (`r.Run(port)`).

### D. Camada de Roteamento (`routers/routers.go`)
- Recebe a instância do `service.Service` e do `gin.Engine`.
- Mapeia os métodos HTTP e endpoints diretamente para os handlers do serviço:
  ```go
  func Register(svc service.Service, r *gin.Engine) {
      r.GET("/users", svc.HandleGetUsers)
      r.POST("/user", svc.HandleCreateUser)
  }
  ```

### E. Camada de Serviço e Handlers (`service/`)
- Concentra a lógica de negócio e os handlers HTTP do Gin.
- Mantém referências para a interface `postgres.Storage`, a instância do `gin.Engine` e as configurações `config.AppConfig`.
- Padroniza o envio de respostas JSON e tratamento de erros.

### F. Camada de Persistência (`postgres/`)
- Define o contrato da interface `Storage` em `store.go`.
- Garante o desacoplamento do banco de dados através de interfaces.
- Concentra todas as queries SQL cruas (`database/sql`) isoladas em arquivos por domínio (`users.go`, `orders.go`, etc.).

---

## 3. Regras Obrigatórias de Arquitetura

1. **Injeção de Dependências**: As dependências (DB, Config, Engine) devem sempre ser passadas via construtores (`NewAPIServer`, `NewStore`, `NewService`).
2. **Desacoplamento por Interface**: O serviço interage apenas com a interface `postgres.Storage`, permitindo mocks em testes unitários.
3. **Imutabilidade e Thread-Safety**: Conexões com banco (`*sql.DB`) e instâncias de configuração devem ser reutilizadas e compartilhadas com segurança.
4. **Sincronização Obrigatória com Bruno**: Todo endpoint criado ou alterado DEVE ter seu arquivo correspondente gerado ou atualizado em `apps/backend/bruno/`. Consulte e aplique as skills `skills/backend/bruno-collection-generator/SKILL.md` e `skills/backend/bruno-test-writer/SKILL.md`. Nenhuma tarefa de endpoint é considerada completa sem a requisição do Bruno.
