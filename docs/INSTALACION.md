# Guía de Instalación - Sistema de Gestión de Citas Médicas

## Prerrequisitos

### Software Requerido
- **Node.js** 18.x o superior ([Descargar](https://nodejs.org/))
- **.NET 8.0 SDK** ([Descargar](https://dotnet.microsoft.com/download))
- **SQL Server 2019+** o **SQL Server Express** ([Descargar](https://www.microsoft.com/sql-server/sql-server-downloads))
- **SQL Server Management Studio (SSMS)** (Opcional pero recomendado)
- **Visual Studio 2022** o **Visual Studio Code** con extensiones de C#

---

## Instalación Paso a Paso

### 1. Configuración de la Base de Datos

#### 1.1. Crear la Base de Datos
1. Abre **SQL Server Management Studio**
2. Conéctate a tu instancia de SQL Server
3. Abre el archivo `database/01_CreateDatabase.sql`
4. **IMPORTANTE**: Modifica las rutas de los archivos de datos según tu configuración:
   ```sql
   FILENAME = 'C:\SQLData\ClinicaMedicaDB_Data.mdf'
   ```
   Cambia `C:\SQLData\` por la ruta donde quieras almacenar los archivos
5. Ejecuta el script (F5)

#### 1.2. Crear las Tablas
1. Abre el archivo `database/02_CreateTables.sql`
2. Ejecuta el script completo
3. Verifica que se crearon 10 tablas correctamente

#### 1.3. Insertar Datos de Prueba
1. Abre el archivo `database/03_SeedData.sql`
2. Ejecuta el script
3. Verifica los datos insertados con:
   ```sql
   SELECT * FROM Usuarios;
   SELECT * FROM Especialidades;
   SELECT * FROM Medicos;
   ```

---

### 2. Configuración del Backend (.NET)

#### 2.1. Restaurar Dependencias
```bash
cd backend/ClinicaAPI
dotnet restore
```

#### 2.2. Configurar Connection String
1. Abre `backend/ClinicaAPI/appsettings.json`
2. Modifica la cadena de conexión según tu configuración:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=ClinicaMedicaDB;Trusted_Connection=True;TrustServerCertificate=True"
     }
   }
   ```
   
   **Opciones comunes:**
   - **SQL Server Express**: `Server=localhost\\SQLEXPRESS;Database=ClinicaMedicaDB;...`
   - **Con usuario/contraseña**: `Server=localhost;Database=ClinicaMedicaDB;User Id=sa;Password=TuPassword;...`

#### 2.3. Compilar y Ejecutar
```bash
dotnet build
dotnet run
```

La API estará disponible en:
- **HTTPS**: https://localhost:7001
- **HTTP**: http://localhost:5001
- **Swagger UI**: https://localhost:7001/swagger

---

### 3. Configuración del Frontend (React)

#### 3.1. Instalar Dependencias
```bash
cd frontend
npm install
```

#### 3.2. Configurar Variables de Entorno (Opcional)
Crea un archivo `.env.local` en la carpeta `frontend`:
```env
VITE_API_URL=https://localhost:7001/api
```

#### 3.3. Ejecutar en Modo Desarrollo
```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## Verificación de la Instalación

### 1. Verificar Backend
1. Abre el navegador en https://localhost:7001/swagger
2. Deberías ver la documentación de la API con todos los endpoints
3. Prueba el endpoint `/api/Medicos/especialidades`

### 2. Verificar Frontend
1. Abre http://localhost:5173
2. Deberías ver la página de inicio de sesión
3. Intenta registrarte con un nuevo usuario
4. Credenciales de prueba:
   - **Email**: carlos.perez@email.com
   - **Password**: Password123!

### 3. Verificar Integración
1. Inicia sesión con las credenciales de prueba
2. Navega al Dashboard
3. Intenta agendar una nueva cita
4. Verifica que los datos se muestren correctamente

---

## Usuarios de Prueba

### Pacientes
| Email | Password | Nombre |
|-------|----------|--------|
| carlos.perez@email.com | Password123! | Carlos Pérez Gómez |
| maria.rodriguez@email.com | Password123! | María Rodríguez Silva |

### Médicos
| Email | Password | Nombre | Especialidad |
|-------|----------|--------|--------------|
| roberto.sanchez@clinica.com | Password123! | Dr. Roberto Sánchez | Cardiología |
| martha.quiroz@clinica.com | Password123! | Dra. Martha Quiroz | Cardiología |

### Administrador
| Email | Password | Nombre |
|-------|----------|--------|
| admin@clinica.com | Password123! | Dr. Alex Rivers |

---

## Solución de Problemas

### Error: No se puede conectar a SQL Server
**Solución:**
1. Verifica que SQL Server esté ejecutándose
2. Comprueba el firewall de Windows
3. Verifica la cadena de conexión en `appsettings.json`

### Error: CORS al consumir la API
**Solución:**
1. Verifica que el backend esté ejecutándose
2. Comprueba la configuración de CORS en `Program.cs`
3. Asegúrate de que la URL del frontend esté en `appsettings.json`

### Error: npm install falla
**Solución:**
1. Elimina la carpeta `node_modules`
2. Elimina `package-lock.json`
3. Ejecuta `npm cache clean --force`
4. Vuelve a ejecutar `npm install`

### Error: Certificado SSL no confiable
**Solución:**
```bash
dotnet dev-certs https --trust
```

---

## Comandos Útiles

### Backend
```bash
# Compilar
dotnet build

# Ejecutar en modo desarrollo
dotnet run

# Ejecutar en modo watch (recarga automática)
dotnet watch run

# Limpiar build
dotnet clean
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

### Base de Datos
```sql
-- Ver todas las tablas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Ver estructura de una tabla
EXEC sp_help 'Usuarios';

-- Limpiar datos (solo desarrollo)
DELETE FROM Citas;
DELETE FROM Medicos;
DELETE FROM Usuarios WHERE TipoUsuario = 'Paciente';
```

---

## Próximos Pasos

1. **Producción**: Configura variables de entorno seguras
2. **Deploy**: Considera Azure App Service o IIS para el backend
3. **Frontend**: Despliega en Netlify, Vercel o Azure Static Web Apps
4. **Base de Datos**: Configura backups automáticos
5. **Monitoreo**: Implementa Application Insights o similar

---

## Soporte

Para más información o soporte, consulta:
- **Documentación**: `/docs`
- **Diagramas**: `/diagrams` (Abrir con draw.io)
- **README**: `/README.md`
