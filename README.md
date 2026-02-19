# Sistema de Gestión de Citas Médicas

Plataforma web para el registro y agendamiento de citas médicas preventivas.

## 🏗️ Arquitectura

- **Frontend**: React 18 + TypeScript + TailwindCSS + Vite
- **Backend**: .NET 8.0 Web API
- **Base de Datos**: SQL Server 2019+
- **Diagramas**: Draw.io

## 📋 Módulos

### 1. Módulo de Registro de Usuarios
- Registro de pacientes con validación
- Autenticación y autorización
- Gestión de perfiles

### 2. Módulo de Gestión de Citas
- Búsqueda de médicos por especialidad
- Agendamiento de citas con selección de fecha/hora
- Confirmación y cancelación de citas
- Historial de citas
- Dashboard de citas próximas

## 🚀 Requisitos Previos

- Node.js 18+ y npm
- .NET 8.0 SDK
- SQL Server 2019+
- Visual Studio 2022 o VS Code

## 📦 Instalación

### 1. Base de Datos

```bash
cd database
# Ejecutar scripts en SQL Server Management Studio en este orden:
# 1. 01_CreateDatabase.sql
# 2. 02_CreateTables.sql
# 3. 03_SeedData.sql
```

### 2. Backend API

```bash
cd backend/ClinicaAPI
dotnet restore
dotnet build
# Configurar connection string en appsettings.json
dotnet run
```

La API estará disponible en: `https://localhost:7001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🗂️ Estructura del Proyecto

```
WEB-CLINICA/
├── backend/               # API .NET Core
│   └── ClinicaAPI/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── Data/
├── frontend/             # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── public/
├── database/            # Scripts SQL Server
│   ├── 01_CreateDatabase.sql
│   ├── 02_CreateTables.sql
│   └── 03_SeedData.sql
├── diagrams/           # Diagramas Draw.io
│   ├── arquitectura.drawio
│   └── modelo-datos.drawio
└── docs/              # Documentación
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- JWT para autenticación
- Validación de datos en frontend y backend
- Protección contra SQL injection
- CORS configurado

## 📱 Funcionalidades

### Dashboard Principal
- Vista de citas próximas
- Historial de citas
- Acceso rápido a agendar nueva cita

### Agendamiento
- Búsqueda de médicos por especialidad/nombre/sede
- Visualización de disponibilidad
- Selección de fecha y hora
- Confirmación inmediata

### Perfil de Usuario
- Datos personales
- Historial médico
- Configuración de cuenta

## 🎨 Diseño

La interfaz está basada en los prototipos proporcionados con:
- Paleta de colores azul corporativo
- Diseño responsivo
- Componentes modernos y accesibles
- Experiencia de usuario optimizada

## 📄 Licencia

Desarrollado para Clínica Médica - 2024
