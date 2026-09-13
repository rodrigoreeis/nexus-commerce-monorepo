export PATH := /usr/local/go/bin:$(HOME)/go/bin:$(PATH)

COMPOSE_CMD ?= $(shell command -v podman-compose 2>/dev/null || echo "docker compose")
CONTAINER_CLI ?= $(shell command -v podman 2>/dev/null || echo docker)

.PHONY: run build migrate compose-up compose-down

compose-up:
	$(COMPOSE_CMD) up -d

compose-down:
	$(COMPOSE_CMD) down

run:
	go run main.go

build:
	mkdir -p bin && go build -o bin/api main.go

migrate:
	@echo "Applying migrations to PostgreSQL..."
	@for file in migrations/*.sql; do \
		echo "Applying $$file..."; \
		$(CONTAINER_CLI) exec -i nexus_postgres psql -U nexus_user -d nexus_commerce < $$file; \
	done
	@echo "All migrations applied successfully."
