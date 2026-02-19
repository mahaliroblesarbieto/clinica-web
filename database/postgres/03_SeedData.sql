-- Datos de prueba para PostgreSQL
-- Ejecutar después de crear las tablas

-- Insertar Especialidades
INSERT INTO "Especialidades" ("Nombre", "Descripcion", "Activo") VALUES
('Cardiología', 'Especialidad médica que se ocupa del corazón y sistema circulatorio', true),
('Pediatría', 'Medicina especializada en la salud infantil', true),
('Dermatología', 'Especialidad centrada en enfermedades de la piel', true),
('Neurología', 'Estudio del sistema nervioso y sus trastornos', true),
('Traumatología', 'Tratamiento de lesiones del sistema musculoesquelético', true),
('Ginecología', 'Salud reproductiva y del sistema reproductor femenino', true),
('Oftalmología', 'Especialidad médica de los ojos', true),
('Odontología', 'Diagnóstico y tratamiento de enfermedades dentales', true),
('Medicina General', 'Atención médica integral y primaria', true),
('Psiquiatría', 'Diagnóstico y tratamiento de trastornos mentales', true);

-- Insertar Sedes
INSERT INTO "Sedes" ("Nombre", "Direccion", "Telefono", "Ciudad", "Activo") VALUES
('Sede Norte', 'Calle 123 #45-67', '3001234567', 'Bogotá', true),
('Sede Sur', 'Carrera 89 #12-34', '3009876543', 'Bogotá', true),
('Sede Centro', 'Avenida Principal #56-78', '3005551234', 'Bogotá', true),
('Sede Chapinero', 'Calle 60 #10-20', '3007778888', 'Bogotá', true);

-- Insertar Usuarios (Password: Password123! - hasheado con BCrypt)
INSERT INTO "Usuarios" ("NombreCompleto", "Email", "PasswordHash", "Telefono", "FechaNacimiento", "Genero", "Direccion", "TipoUsuario", "Activo") VALUES
-- Pacientes
('Carlos Pérez Gómez', 'carlos.perez@email.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3001234567', '1985-05-15', 'Masculino', 'Calle 50 #20-30', 'Paciente', true),
('María Rodríguez Silva', 'maria.rodriguez@email.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3009876543', '1990-08-22', 'Femenino', 'Carrera 70 #45-12', 'Paciente', true),
('Juan Martínez López', 'juan.martinez@email.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3005551234', '1988-03-10', 'Masculino', 'Avenida 30 #15-25', 'Paciente', true),
('Ana García Torres', 'ana.garcia@email.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3007778888', '1992-11-30', 'Femenino', 'Calle 80 #60-40', 'Paciente', true),
-- Médicos
('Dr. Roberto Sánchez', 'roberto.sanchez@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3101234567', '1975-06-20', 'Masculino', 'Consultorio Médico', 'Medico', true),
('Dra. Martha Quiroz', 'martha.quiroz@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3109876543', '1980-09-15', 'Femenino', 'Consultorio Médico', 'Medico', true),
('Dr. Luis Fernando Gómez', 'luis.gomez@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3105551234', '1978-12-05', 'Masculino', 'Consultorio Médico', 'Medico', true),
('Dra. Patricia Ramírez', 'patricia.ramirez@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3107778888', '1982-04-18', 'Femenino', 'Consultorio Médico', 'Medico', true),
('Dr. Miguel Ángel Castro', 'miguel.castro@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3102223333', '1976-07-25', 'Masculino', 'Consultorio Médico', 'Medico', true),
('Dra. Sofia Hernández', 'sofia.hernandez@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3104445555', '1984-10-08', 'Femenino', 'Consultorio Médico', 'Medico', true),
-- Administrador
('Dr. Alex Rivers', 'admin@clinica.com', '$2a$11$Zv3qWq3YJZ.k9XwYqXqXuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', '3100001111', '1970-01-01', 'Masculino', 'Administración', 'Administrador', true);

-- Insertar Médicos (relacionar con usuarios médicos)
INSERT INTO "Medicos" ("UsuarioID", "EspecialidadID", "NumeroLicencia", "AniosExperiencia", "Calificacion", "FotoURL", "Biografia", "Activo") VALUES
(5, 1, 'LIC-CARD-001', 15, 4.8, 'https://via.placeholder.com/150', 'Especialista en cardiología con amplia experiencia en cirugía cardiovascular.', true),
(6, 1, 'LIC-CARD-002', 12, 4.9, 'https://via.placeholder.com/150', 'Cardióloga enfocada en prevención y cuidado cardíaco integral.', true),
(7, 2, 'LIC-PEDI-001', 10, 4.7, 'https://via.placeholder.com/150', 'Pediatra especializado en cuidado infantil desde recién nacidos.', true),
(8, 3, 'LIC-DERM-001', 8, 4.6, 'https://via.placeholder.com/150', 'Dermatóloga experta en tratamientos estéticos y médicos de la piel.', true),
(9, 9, 'LIC-MG-001', 20, 4.8, 'https://via.placeholder.com/150', 'Médico general con amplia experiencia en atención primaria.', true),
(10, 6, 'LIC-GINE-001', 14, 4.9, 'https://via.placeholder.com/150', 'Ginecóloga especializada en salud reproductiva femenina.', true);

-- Asignar Médicos a Sedes
INSERT INTO "MedicosSedes" ("MedicoID", "SedeID") VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 2), (3, 4),
(4, 1), (4, 3),
(5, 2), (5, 4),
(6, 1), (6, 2), (6, 3);

-- Insertar Horarios Disponibles
INSERT INTO "HorariosDisponibles" ("MedicoID", "SedeID", "DiaSemana", "HoraInicio", "HoraFin", "Disponible") VALUES
-- Dr. Roberto Sánchez - Sede Norte
(1, 1, 'Lunes', '08:00', '12:00', true),
(1, 1, 'Lunes', '14:00', '18:00', true),
(1, 1, 'Miércoles', '08:00', '12:00', true),
(1, 1, 'Viernes', '14:00', '18:00', true),
-- Dra. Martha Quiroz - Sede Norte
(2, 1, 'Martes', '09:00', '13:00', true),
(2, 1, 'Jueves', '09:00', '13:00', true),
(2, 1, 'Viernes', '14:00', '17:00', true),
-- Dr. Luis Fernando Gómez - Sede Sur
(3, 2, 'Lunes', '08:00', '12:00', true),
(3, 2, 'Miércoles', '14:00', '18:00', true),
(3, 2, 'Viernes', '08:00', '12:00', true);

-- Insertar Citas de ejemplo
INSERT INTO "Citas" ("PacienteID", "MedicoID", "SedeID", "FechaCita", "TipoServicio", "Estado", "MotivoConsulta", "ValorConsulta", "ValorCobertura", "TotalPagar") VALUES
(1, 1, 1, NOW() + INTERVAL '7 days', 'Consulta Cardiológica', 'Confirmada', 'Control de presión arterial', 180000, 145000, 35000),
(2, 3, 2, NOW() + INTERVAL '3 days', 'Control Pediátrico', 'Pendiente', 'Revisión general del bebé', 120000, 90000, 30000),
(3, 5, 2, NOW() + INTERVAL '5 days', 'Consulta General', 'Confirmada', 'Dolor de cabeza persistente', 100000, 70000, 30000),
(4, 2, 1, NOW() + INTERVAL '10 days', 'Cardiología Preventiva', 'Pendiente', 'Chequeo anual', 180000, 145000, 35000);

-- Insertar Notificaciones de ejemplo
INSERT INTO "Notificaciones" ("UsuarioID", "Tipo", "Mensaje", "Leida") VALUES
(1, 'Recordatorio', 'Tienes una cita programada para el próximo lunes a las 10:00 AM', false),
(2, 'Confirmación', 'Tu cita ha sido confirmada exitosamente', true);
