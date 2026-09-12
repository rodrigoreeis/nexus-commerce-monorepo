---
name: golang-database-repository
description: >-
  Padrões de acesso ao banco de dados PostgreSQL em Golang usando a biblioteca padrão database/sql, interfaces de armazenamento e migrações SQL. Use esta skill sempre que for criar consultas SQL, modelos de dados ou migrações.
---

# Golang Database Repository & PostgreSQL Guidelines

Esta skill define as convenções para integração com **PostgreSQL** em **Golang** no Nexus Commerce, seguindo a abordagem com `database/sql`, SQL nativo e migrações versionadas.

## 1. Conexão com Banco de Dados (`postgres/connection.go`)

- Utilize o driver oficial do PostgreSQL (`github.com/lib/pq`).
- Configure a string de conexão (DSN) usando as configurações da aplicação.
- Garanta a verificação da conexão via `db.Ping()`.

```go
package postgres

import (
	"database/sql"
	"fmt"
	"log/slog"

	_ "github.com/lib/pq"
	"<project-module>/config"
)

func NewDBConnection(cfg config.AppConfig) *sql.DB {
	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.DBName,
	)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		slog.Error("Erro ao conectar no banco de dados:", err)
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		slog.Error("Erro ao pingar banco de dados:", err)
		panic(err)
	}

	slog.Info("Conexão com PostgreSQL estabelecida com sucesso")
	return db
}
```

## 2. Contrato de Armazenamento (`postgres/store.go`)

- Todas as operações de banco devem ser expostas através da interface `Storage`.
- A struct `Store` encapsula a referência `*sql.DB` e `config.AppConfig`.

```go
package postgres

import (
	"database/sql"
	"<project-module>/config"
)

type Storage interface {
	GetAllUsers() ([]User, error)
	CreateUser(name string, email string, password string) error
	GetUserByEmail(email string) (User, error)
}

type Store struct {
	db  *sql.DB
	cfg config.AppConfig
}

func NewStore(db *sql.DB, cfg config.AppConfig) *Store {
	return &Store{db: db, cfg: cfg}
}
```

## 3. Implementação de Queries (`postgres/<entidade>.go`)

- Escreva queries SQL preparadas (`db.Query`, `db.QueryRow`, `db.Exec`).
- Sempre feche os ponteiros de consulta com `defer rows.Close()`.
- Mapeie explicitamente as colunas para structs Go (`rows.Scan(&user.ID, &user.Name, ...)`).

```go
func (s *Store) GetAllUsers() ([]User, error) {
	query := `SELECT id, name, email, created_at FROM users`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}
```

## 4. Migrações SQL Versionadas (`migrations/`)

- Todas as alterações de schema devem ser registradas em arquivos `.sql` numerados e sequenciais na pasta `migrations/`.
- Nomes dos arquivos devem ser descritivos:
  - `01-starting-setup.sql`
  - `02-setting-default-current-time.sql`
  - `03-adding-password-users-column.sql`
- Utilize tipos nativos do PostgreSQL (`UUID`, `TIMESTAMP WITH TIME ZONE`, `VARCHAR`, `BOOLEAN`).
- Garanta valores padrão apropriados (`DEFAULT CURRENT_TIMESTAMP`, `DEFAULT gen_random_uuid()`).
