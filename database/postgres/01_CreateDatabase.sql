-- Script para PostgreSQL
-- Crear base de datos ClinicaMedicaDB

-- Conectarse como usuario postgres y ejecutar:
CREATE DATABASE "ClinicaMedicaDB"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectarse a la base de datos recién creada
\c ClinicaMedicaDB;

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
