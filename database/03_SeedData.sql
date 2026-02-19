-- ================================================
-- Script: Datos Iniciales (Seed Data)
-- Descripción: Inserción de datos de prueba
-- ================================================

USE ClinicaMedicaDB;
GO

-- ================================================
-- Insertar Especialidades
-- ================================================
INSERT INTO Especialidades (Nombre, Descripcion) VALUES
('Cardiología', 'Especialidad médica que se ocupa de las afecciones del corazón y del aparato circulatorio'),
('Dermatología', 'Especialidad médica que se ocupa del estudio de la piel y sus enfermedades'),
('Medicina General', 'Atención médica general y preventiva'),
('Pediatría', 'Especialidad médica que estudia al niño y sus enfermedades'),
('Ginecología', 'Especialidad médica que trata las enfermedades del sistema reproductor femenino'),
('Oftalmología', 'Especialidad médica que estudia las enfermedades de los ojos'),
('Traumatología', 'Especialidad médica que se dedica al estudio de las lesiones del aparato locomotor'),
('Psiquiatría', 'Especialidad médica dedicada al estudio y tratamiento de las enfermedades mentales'),
('Neurología', 'Especialidad médica que trata los trastornos del sistema nervioso'),
('Ortopedia', 'Especialidad médica dedicada a corregir o de evitar las deformidades del sistema musculoesquelético');
GO

-- ================================================
-- Insertar Sedes
-- ================================================
INSERT INTO Sedes (Nombre, Direccion, Ciudad, Telefono, Email) VALUES
('Sede Norte - Cons. 402', 'Calle 127 # 15-30', 'Bogotá', '01-800-123-4567', 'norte@clinica.com'),
('Sede Centro', 'Carrera 7 # 45-20', 'Bogotá', '01-800-123-4568', 'centro@clinica.com'),
('Sede Chicó', 'Carrera 15 # 93-45', 'Bogotá', '01-800-123-4569', 'chico@clinica.com'),
('Sede Salitre', 'Avenida 68 # 24-50', 'Bogotá', '01-800-123-4570', 'salitre@clinica.com');
GO

-- ================================================
-- Insertar Usuarios (Pacientes y Médicos)
-- Nota: Password es "Password123!" hasheado con bcrypt
-- ================================================

-- Pacientes
INSERT INTO Usuarios (NombreCompleto, Email, PasswordHash, FechaNacimiento, Telefono, TipoUsuario) VALUES
('Carlos Pérez Gómez', 'carlos.perez@email.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1985-06-15', '3001234567', 'Paciente'),
('María Rodríguez Silva', 'maria.rodriguez@email.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1990-03-22', '3009876543', 'Paciente'),
('Juan David López', 'juan.lopez@email.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1988-11-08', '3015551234', 'Paciente'),
('Ana Martínez Castro', 'ana.martinez@email.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1992-07-30', '3027778899', 'Paciente');

-- Médicos (también son usuarios)
INSERT INTO Usuarios (NombreCompleto, Email, PasswordHash, FechaNacimiento, Telefono, TipoUsuario) VALUES
('Dra. Sarah Jenkins', 'sarah.jenkins@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1978-04-12', '3101234567', 'Medico'),
('Dr. Michael Chen', 'michael.chen@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1982-09-25', '3109876543', 'Medico'),
('Dr. Roberto Sánchez', 'roberto.sanchez@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1975-02-18', '3105551234', 'Medico'),
('Dra. Martha Quiroz', 'martha.quiroz@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1980-12-05', '3107778899', 'Medico'),
('Dr. Emily Blunt', 'emily.blunt@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1983-08-14', '3103334455', 'Medico'),
('Dr. James Wilson', 'james.wilson@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1976-05-22', '3106667788', 'Medico');

-- Administrador
INSERT INTO Usuarios (NombreCompleto, Email, PasswordHash, FechaNacimiento, Telefono, TipoUsuario) VALUES
('Dr. Alex Rivers', 'admin@clinica.com', '$2a$11$LZKnhkXqGJZfVlz4Iy4nB.xdJhM8F7QNdK8u3jKHn8SqK3KYXmYNy', '1970-01-15', '3100001111', 'Administrador');
GO

-- ================================================
-- Insertar Médicos (Información adicional)
-- ================================================
INSERT INTO Medicos (UsuarioID, EspecialidadID, NumeroLicencia, Biografia, FotoURL, Calificacion, NumeroResenas, AnosExperiencia) VALUES
(5, 1, 'MED-001-2024', 'Especialista en insuficiencia cardíaca con más de 15 años de experiencia en centros de alto complejidad.', '/images/doctors/sarah-jenkins.jpg', 4.9, 124, 15),
(6, 2, 'MED-002-2024', 'Experta en ecocardiografía y prevención cardiovascular integral.', '/images/doctors/michael-chen.jpg', 4.7, 89, 12),
(7, 1, 'MED-003-2024', 'Cardiólogo clínico especialista en insuficiencia cardíaca con más de 15 años de experiencia en centros de alto complejidad.', '/images/doctors/roberto-sanchez.jpg', 4.9, 121, 16),
(8, 1, 'MED-004-2024', 'Experta en ecocardiografía y prevención cardiovascular integral. Certificada en cardiología no invasiva.', '/images/doctors/martha-quiroz.jpg', 4.7, 89, 10),
(9, 3, 'MED-005-2024', 'Médica general con amplia experiencia en atención primaria y medicina preventiva.', '/images/doctors/emily-blunt.jpg', 4.8, 95, 12),
(10, 7, 'MED-006-2024', 'Especialista en traumatología y ortopedia, enfocado en lesiones deportivas.', '/images/doctors/james-wilson.jpg', 4.6, 78, 14);
GO

-- ================================================
-- Insertar relación Médicos-Sedes
-- ================================================
INSERT INTO MedicosSedes (MedicoID, SedeID) VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 1), (3, 2),
(4, 2), (4, 3),
(5, 3), (5, 4),
(6, 1), (6, 4);
GO

-- ================================================
-- Insertar Horarios Disponibles
-- ================================================
-- Dra. Sarah Jenkins - Lunes a Viernes mañanas
INSERT INTO HorariosDisponibles (MedicoID, SedeID, DiaSemana, HoraInicio, HoraFin) VALUES
(1, 1, 1, '08:00', '12:00'),
(1, 1, 2, '08:00', '12:00'),
(1, 1, 3, '08:00', '12:00'),
(1, 1, 4, '08:00', '12:00'),
(1, 1, 5, '08:00', '12:00');

-- Dr. Michael Chen - Tardes
INSERT INTO HorariosDisponibles (MedicoID, SedeID, DiaSemana, HoraInicio, HoraFin) VALUES
(2, 1, 1, '14:00', '18:00'),
(2, 1, 3, '14:00', '18:00'),
(2, 1, 5, '14:00', '18:00');

-- Dr. Roberto Sánchez
INSERT INTO HorariosDisponibles (MedicoID, SedeID, DiaSemana, HoraInicio, HoraFin) VALUES
(3, 1, 1, '08:00', '14:00'),
(3, 1, 2, '08:00', '14:00'),
(3, 1, 4, '08:00', '14:00');

-- Dra. Martha Quiroz
INSERT INTO HorariosDisponibles (MedicoID, SedeID, DiaSemana, HoraInicio, HoraFin) VALUES
(4, 2, 2, '09:00', '17:00'),
(4, 2, 4, '09:00', '17:00');
GO

-- ================================================
-- Insertar Citas de Ejemplo
-- ================================================
INSERT INTO Citas (PacienteID, MedicoID, SedeID, FechaCita, TipoServicio, Estado, ValorConsulta, ValorCobertura, TotalPagar, FechaCreacion) VALUES
(1, 1, 1, '2023-09-12 09:15:00', 'General Wellness', 'Completada', 180000, 145000, 35000, '2023-09-01'),
(1, 6, 1, '2023-08-05 02:00:00', 'Orthopedics', 'Completada', 200000, 150000, 50000, '2023-07-25'),
(2, 3, 1, '2023-10-24 10:00:00', 'Cardiología', 'Confirmada', 180000, 0, 180000, '2023-10-15'),
(3, 4, 2, '2023-10-27 03:30:00', 'Dermatología', 'Pendiente', 150000, 0, 150000, '2023-10-20');
GO

-- ================================================
-- Insertar Reseñas
-- ================================================
INSERT INTO Resenas (CitaID, PacienteID, MedicoID, Calificacion, Comentario) VALUES
(1, 1, 1, 5, 'Excelente atención, muy profesional y amable.'),
(2, 1, 6, 4, 'Buen servicio, resolvió todas mis dudas.');
GO

PRINT 'Datos iniciales insertados exitosamente.';
GO

-- ================================================
-- Consultas de verificación
-- ================================================
PRINT '========================================';
PRINT 'VERIFICACIÓN DE DATOS';
PRINT '========================================';

PRINT 'Total Usuarios: ';
SELECT COUNT(*) AS Total FROM Usuarios;

PRINT 'Total Especialidades: ';
SELECT COUNT(*) AS Total FROM Especialidades;

PRINT 'Total Sedes: ';
SELECT COUNT(*) AS Total FROM Sedes;

PRINT 'Total Médicos: ';
SELECT COUNT(*) AS Total FROM Medicos;

PRINT 'Total Citas: ';
SELECT COUNT(*) AS Total FROM Citas;

GO
