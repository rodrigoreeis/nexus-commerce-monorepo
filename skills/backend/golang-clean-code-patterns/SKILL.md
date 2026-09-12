---
name: golang-clean-code-patterns
description: >-
  Padrões de desenvolvimento em Go, utilitários, tratamento de erros, respostas HTTP padronizadas com Gin e logs estruturados com slog. Use esta skill ao implementar handlers, validações ou serviços backend.
---

# Golang Clean Code & API Response Patterns

Esta skill estabelece os padrões de código, respostas HTTP e tratamento de exceções para serviços em **Golang** no Nexus Commerce.

## 1. Estrutura de Resposta HTTP Padronizada (`service/service.go`)

Todas as APIs do Nexus Commerce em Go devem utilizar o formato unificado de resposta em JSON:

```go
type Response struct {
	Message string      `json:"message,omitempty"`
	Error   bool        `json:"error,omitempty"`
	Success bool        `json:"success,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}
```

### Helpers de Resposta no Service Struct

```go
// Resposta de Sucesso (HTTP 200 OK)
func (s *Service) HandleResponseAPIOK(c *gin.Context, data interface{}, message string) {
	slog.Info("HandleResponseAPIOK: ", message, 0)

	c.JSON(http.StatusOK, Response{
		Message: message,
		Data:    data,
		Success: true,
	})
}

// Resposta de Erro (HTTP 400 Bad Request ou HTTP 500 Internal Server Error)
func (s *Service) HandleResponseError(c *gin.Context, message string, err error) {
	slog.Error("HandleResponseError: ", err, 0)

	if message == "" {
		c.JSON(http.StatusInternalServerError, Response{
			Message: "Ocorreu um erro interno. Tente novamente mais tarde.",
			Error:   true,
		})
	} else {
		c.JSON(http.StatusBadRequest, Response{
			Message: message,
			Error:   true,
		})
	}
}
```

## 2. Logs Estruturados (`log/slog`)

- Utilize o pacote nativo `log/slog` do Go para todos os logs da aplicação.
- Registre o contexto das chamadas (mensagens de erro, porta do servidor, progresso de registro de rotas).
- Evite o uso de `fmt.Println` em ambiente de produção.

## 3. Segurança e Utilitários de Criptografia (`utils/crypto.go`)

- Hashing seguro de senhas via `golang.org/x/crypto/bcrypt`.
- Verificação de senhas em tempo constante para evitar ataques de temporização.

```go
package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
```

## 4. Convenções Gerais de Código em Go

- **Nomenclatura**: Nomes de pacotes pequenos e concisos em minúsculas (ex: `postgres`, `service`, `config`).
- **Tratamento de Erros**: Sempre verifique e trate `if err != nil`. Retorne erros para as camadas superiores ou trate com o helper `HandleResponseError`.
- **Early Returns**: Utilize saídas antecipadas para evitar encadeamento desnecessário de `if/else`.
