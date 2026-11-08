-- Migration: 04-create-backoffice-users.sql
-- Description: Criação da tabela de usuários do Backoffice com suporte a RBAC e seed do usuário admin root

CREATE TABLE IF NOT EXISTS backoffice_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backoffice_users_email ON backoffice_users(email);

-- Seed do usuário admin root padrão: admin@nexuscommerce.com / senha: admin123
INSERT INTO backoffice_users (id, name, email, password_hash, role)
VALUES (
    gen_random_uuid(),
    'Nexus Admin',
    'admin@nexuscommerce.com',
    '$2a$10$fEMXZH5v9D2nP6RqyCg3w.CQ1To0pRa1pl5lET9FZ5snpAVBmnK3m',
    'admin'
)
ON CONFLICT (email) DO NOTHING;
