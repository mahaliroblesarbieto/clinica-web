-- ================================================
-- Script: Crear Base de Datos
-- Descripción: Creación de la base de datos para el sistema de gestión de citas médicas
-- Autor: Sistema de Gestión de Citas
-- Fecha: 2024
-- ================================================

USE master;
GO

-- Eliminar la base de datos si existe (solo para desarrollo)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ClinicaMedicaDB')
BEGIN
    ALTER DATABASE ClinicaMedicaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ClinicaMedicaDB;
END
GO

-- Crear la base de datos
CREATE DATABASE ClinicaMedicaDB
ON PRIMARY
(
    NAME = 'ClinicaMedicaDB_Data',
    FILENAME = 'C:\SQLData\ClinicaMedicaDB_Data.mdf',
    SIZE = 50MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10MB
)
LOG ON
(
    NAME = 'ClinicaMedicaDB_Log',
    FILENAME = 'C:\SQLData\ClinicaMedicaDB_Log.ldf',
    SIZE = 25MB,
    MAXSIZE = 500MB,
    FILEGROWTH = 5MB
);
GO

-- Configurar la base de datos
ALTER DATABASE ClinicaMedicaDB SET RECOVERY SIMPLE;
ALTER DATABASE ClinicaMedicaDB SET AUTO_SHRINK OFF;
ALTER DATABASE ClinicaMedicaDB SET AUTO_CREATE_STATISTICS ON;
ALTER DATABASE ClinicaMedicaDB SET AUTO_UPDATE_STATISTICS ON;
GO

USE ClinicaMedicaDB;
GO

PRINT 'Base de datos ClinicaMedicaDB creada exitosamente.';
GO
