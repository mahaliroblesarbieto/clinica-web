-- Tablas para PostgreSQL
-- Ejecutar después de crear la base de datos

-- Tabla de Usuarios
CREATE TABLE "Usuarios" (
    "UsuarioID" SERIAL PRIMARY KEY,
    "NombreCompleto" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(100) UNIQUE NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Telefono" VARCHAR(20),
    "FechaNacimiento" DATE,
    "Genero" VARCHAR(10),
    "Direccion" VARCHAR(200),
    "TipoUsuario" VARCHAR(20) NOT NULL CHECK ("TipoUsuario" IN ('Paciente', 'Medico', 'Administrador')),
    "FechaRegistro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "Activo" BOOLEAN DEFAULT TRUE
);

-- Tabla de Especialidades
CREATE TABLE "Especialidades" (
    "EspecialidadID" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN DEFAULT TRUE
);

-- Tabla de Sedes
CREATE TABLE "Sedes" (
    "SedeID" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL,
    "Direccion" VARCHAR(200) NOT NULL,
    "Telefono" VARCHAR(20),
    "Ciudad" VARCHAR(50) NOT NULL,
    "Activo" BOOLEAN DEFAULT TRUE
);

-- Tabla de Médicos
CREATE TABLE "Medicos" (
    "MedicoID" SERIAL PRIMARY KEY,
    "UsuarioID" INTEGER NOT NULL REFERENCES "Usuarios"("UsuarioID"),
    "EspecialidadID" INTEGER NOT NULL REFERENCES "Especialidades"("EspecialidadID"),
    "NumeroLicencia" VARCHAR(50) UNIQUE NOT NULL,
    "AniosExperiencia" INTEGER DEFAULT 0,
    "Calificacion" DECIMAL(3,2) DEFAULT 0.0,
    "FotoURL" VARCHAR(500),
    "Biografia" TEXT,
    "Activo" BOOLEAN DEFAULT TRUE
);

-- Tabla de relación Médicos-Sedes (muchos a muchos)
CREATE TABLE "MedicosSedes" (
    "MedicoSedeID" SERIAL PRIMARY KEY,
    "MedicoID" INTEGER NOT NULL REFERENCES "Medicos"("MedicoID"),
    "SedeID" INTEGER NOT NULL REFERENCES "Sedes"("SedeID"),
    "FechaAsignacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("MedicoID", "SedeID")
);

-- Tabla de Horarios Disponibles
CREATE TABLE "HorariosDisponibles" (
    "HorarioID" SERIAL PRIMARY KEY,
    "MedicoID" INTEGER NOT NULL REFERENCES "Medicos"("MedicoID"),
    "SedeID" INTEGER NOT NULL REFERENCES "Sedes"("SedeID"),
    "DiaSemana" VARCHAR(20) NOT NULL CHECK ("DiaSemana" IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')),
    "HoraInicio" TIME NOT NULL,
    "HoraFin" TIME NOT NULL,
    "Disponible" BOOLEAN DEFAULT TRUE
);

-- Tabla de Citas
CREATE TABLE "Citas" (
    "CitaID" SERIAL PRIMARY KEY,
    "PacienteID" INTEGER NOT NULL REFERENCES "Usuarios"("UsuarioID"),
    "MedicoID" INTEGER NOT NULL REFERENCES "Medicos"("MedicoID"),
    "SedeID" INTEGER NOT NULL REFERENCES "Sedes"("SedeID"),
    "FechaCita" TIMESTAMP NOT NULL,
    "TipoServicio" VARCHAR(100) NOT NULL,
    "Estado" VARCHAR(20) DEFAULT 'Pendiente' CHECK ("Estado" IN ('Pendiente', 'Confirmada', 'Completada', 'Cancelada')),
    "MotivoConsulta" TEXT,
    "Observaciones" TEXT,
    "ValorConsulta" DECIMAL(10,2),
    "ValorCobertura" DECIMAL(10,2),
    "TotalPagar" DECIMAL(10,2),
    "FechaCreacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE "Notificaciones" (
    "NotificacionID" SERIAL PRIMARY KEY,
    "UsuarioID" INTEGER NOT NULL REFERENCES "Usuarios"("UsuarioID"),
    "Tipo" VARCHAR(50) NOT NULL,
    "Mensaje" TEXT NOT NULL,
    "Leida" BOOLEAN DEFAULT FALSE,
    "FechaCreacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Historial Médico (opcional)
CREATE TABLE "HistorialMedico" (
    "HistorialID" SERIAL PRIMARY KEY,
    "PacienteID" INTEGER NOT NULL REFERENCES "Usuarios"("UsuarioID"),
    "CitaID" INTEGER REFERENCES "Citas"("CitaID"),
    "Diagnostico" TEXT,
    "Tratamiento" TEXT,
    "Notas" TEXT,
    "FechaRegistro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reseñas (opcional)
CREATE TABLE "Resenas" (
    "ResenaID" SERIAL PRIMARY KEY,
    "PacienteID" INTEGER NOT NULL REFERENCES "Usuarios"("UsuarioID"),
    "MedicoID" INTEGER NOT NULL REFERENCES "Medicos"("MedicoID"),
    "CitaID" INTEGER REFERENCES "Citas"("CitaID"),
    "Calificacion" INTEGER CHECK ("Calificacion" >= 1 AND "Calificacion" <= 5),
    "Comentario" TEXT,
    "FechaResena" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_usuarios_email ON "Usuarios"("Email");
CREATE INDEX idx_citas_paciente ON "Citas"("PacienteID");
CREATE INDEX idx_citas_medico ON "Citas"("MedicoID");
CREATE INDEX idx_citas_fecha ON "Citas"("FechaCita");
CREATE INDEX idx_medicos_especialidad ON "Medicos"("EspecialidadID");
CREATE INDEX idx_horarios_medico ON "HorariosDisponibles"("MedicoID");
