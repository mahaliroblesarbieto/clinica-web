-- ================================================
-- Script: Crear Tablas
-- Descripción: Creación de todas las tablas del sistema
-- ================================================

USE ClinicaMedicaDB;
GO

-- ================================================
-- Tabla: Usuarios
-- ================================================
CREATE TABLE Usuarios (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(200) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Telefono NVARCHAR(20),
    Direccion NVARCHAR(300),
    TipoUsuario NVARCHAR(20) NOT NULL CHECK (TipoUsuario IN ('Paciente', 'Medico', 'Administrador')),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    UltimoAcceso DATETIME NULL,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT CK_Email_Format CHECK (Email LIKE '%_@__%.__%')
);
GO

-- ================================================
-- Tabla: Especialidades
-- ================================================
CREATE TABLE Especialidades (
    EspecialidadID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    Descripcion NVARCHAR(500),
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- ================================================
-- Tabla: Sedes
-- ================================================
CREATE TABLE Sedes (
    SedeID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Direccion NVARCHAR(300) NOT NULL,
    Ciudad NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    Email NVARCHAR(150),
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- ================================================
-- Tabla: Medicos
-- ================================================
CREATE TABLE Medicos (
    MedicoID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT NOT NULL,
    EspecialidadID INT NOT NULL,
    NumeroLicencia NVARCHAR(50) NOT NULL UNIQUE,
    Biografia NVARCHAR(1000),
    FotoURL NVARCHAR(500),
    Calificacion DECIMAL(3,2) DEFAULT 0.00,
    NumeroResenas INT DEFAULT 0,
    AnosExperiencia INT DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Medicos_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Medicos_Especialidades FOREIGN KEY (EspecialidadID) REFERENCES Especialidades(EspecialidadID)
);
GO

-- ================================================
-- Tabla: MedicosSedes (Relación muchos a muchos)
-- ================================================
CREATE TABLE MedicosSedes (
    MedicoSedeID INT IDENTITY(1,1) PRIMARY KEY,
    MedicoID INT NOT NULL,
    SedeID INT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_MedicosSedes_Medicos FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    CONSTRAINT FK_MedicosSedes_Sedes FOREIGN KEY (SedeID) REFERENCES Sedes(SedeID),
    CONSTRAINT UQ_MedicoSede UNIQUE (MedicoID, SedeID)
);
GO

-- ================================================
-- Tabla: HorariosDisponibles
-- ================================================
CREATE TABLE HorariosDisponibles (
    HorarioID INT IDENTITY(1,1) PRIMARY KEY,
    MedicoID INT NOT NULL,
    SedeID INT NOT NULL,
    DiaSemana INT NOT NULL CHECK (DiaSemana BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Horarios_Medicos FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    CONSTRAINT FK_Horarios_Sedes FOREIGN KEY (SedeID) REFERENCES Sedes(SedeID),
    CONSTRAINT CK_HoraFin_Mayor CHECK (HoraFin > HoraInicio)
);
GO

-- ================================================
-- Tabla: Citas
-- ================================================
CREATE TABLE Citas (
    CitaID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT NOT NULL,
    MedicoID INT NOT NULL,
    SedeID INT NOT NULL,
    FechaCita DATETIME NOT NULL,
    Duracion INT NOT NULL DEFAULT 30, -- Duración en minutos
    TipoServicio NVARCHAR(100) NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (Estado IN ('Pendiente', 'Confirmada', 'Completada', 'Cancelada', 'No Asistió')),
    MotivoConsulta NVARCHAR(500),
    NotasMedico NVARCHAR(1000),
    Diagnostico NVARCHAR(1000),
    ValorConsulta DECIMAL(10,2),
    ValorCobertura DECIMAL(10,2),
    TotalPagar DECIMAL(10,2),
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Citas_Pacientes FOREIGN KEY (PacienteID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Citas_Medicos FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    CONSTRAINT FK_Citas_Sedes FOREIGN KEY (SedeID) REFERENCES Sedes(SedeID)
);
GO

-- ================================================
-- Tabla: Notificaciones
-- ================================================
CREATE TABLE Notificaciones (
    NotificacionID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT NOT NULL,
    CitaID INT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Mensaje NVARCHAR(1000) NOT NULL,
    Tipo NVARCHAR(50) NOT NULL CHECK (Tipo IN ('Recordatorio', 'Confirmación', 'Cancelación', 'Información')),
    Leida BIT NOT NULL DEFAULT 0,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Notificaciones_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Notificaciones_Citas FOREIGN KEY (CitaID) REFERENCES Citas(CitaID)
);
GO

-- ================================================
-- Tabla: HistorialMedico
-- ================================================
CREATE TABLE HistorialMedico (
    HistorialID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT NOT NULL,
    CitaID INT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    TipoRegistro NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(2000) NOT NULL,
    ArchivoURL NVARCHAR(500),
    CONSTRAINT FK_Historial_Pacientes FOREIGN KEY (PacienteID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Historial_Citas FOREIGN KEY (CitaID) REFERENCES Citas(CitaID)
);
GO

-- ================================================
-- Tabla: Resenas
-- ================================================
CREATE TABLE Resenas (
    ResenaID INT IDENTITY(1,1) PRIMARY KEY,
    CitaID INT NOT NULL,
    PacienteID INT NOT NULL,
    MedicoID INT NOT NULL,
    Calificacion INT NOT NULL CHECK (Calificacion BETWEEN 1 AND 5),
    Comentario NVARCHAR(1000),
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Resenas_Citas FOREIGN KEY (CitaID) REFERENCES Citas(CitaID),
    CONSTRAINT FK_Resenas_Pacientes FOREIGN KEY (PacienteID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT FK_Resenas_Medicos FOREIGN KEY (MedicoID) REFERENCES Medicos(MedicoID),
    CONSTRAINT UQ_Resena_Cita UNIQUE (CitaID)
);
GO

-- ================================================
-- Índices para mejorar el rendimiento
-- ================================================

CREATE NONCLUSTERED INDEX IX_Usuarios_Email ON Usuarios(Email);
CREATE NONCLUSTERED INDEX IX_Usuarios_TipoUsuario ON Usuarios(TipoUsuario);
CREATE NONCLUSTERED INDEX IX_Medicos_Especialidad ON Medicos(EspecialidadID);
CREATE NONCLUSTERED INDEX IX_Citas_Paciente ON Citas(PacienteID);
CREATE NONCLUSTERED INDEX IX_Citas_Medico ON Citas(MedicoID);
CREATE NONCLUSTERED INDEX IX_Citas_Fecha ON Citas(FechaCita);
CREATE NONCLUSTERED INDEX IX_Citas_Estado ON Citas(Estado);
CREATE NONCLUSTERED INDEX IX_Notificaciones_Usuario ON Notificaciones(UsuarioID, Leida);
GO

PRINT 'Tablas e índices creados exitosamente.';
GO
