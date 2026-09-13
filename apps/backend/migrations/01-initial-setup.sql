-- Migration: 01-initial-setup.sql
-- Enables cryptographic and UUID extensions for Nexus Commerce

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
