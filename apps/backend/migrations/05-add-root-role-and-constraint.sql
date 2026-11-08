-- Migration: 05-add-root-role-and-constraint.sql
-- Description: Introdução da role 'root', atualização do Nexus Admin para root, limpeza de usuários e índice único parcial para garantir um único root.

-- 1. Atualizar a constraint de roles válidas
ALTER TABLE backoffice_users DROP CONSTRAINT IF EXISTS backoffice_users_role_check;
ALTER TABLE backoffice_users ADD CONSTRAINT backoffice_users_role_check 
    CHECK (role IN ('root', 'admin', 'manager', 'user'));

-- 2. Limpar usuários extras de testes e promover o Nexus Admin para 'root'
DELETE FROM backoffice_users WHERE email <> 'admin@nexuscommerce.com';

UPDATE backoffice_users 
SET role = 'root' 
WHERE email = 'admin@nexuscommerce.com';

-- 3. Garantir a nível de engine do PostgreSQL a existência de NO MÁXIMO UM usuário com role 'root'
CREATE UNIQUE INDEX IF NOT EXISTS idx_backoffice_users_unique_root 
ON backoffice_users (role) 
WHERE role = 'root';
