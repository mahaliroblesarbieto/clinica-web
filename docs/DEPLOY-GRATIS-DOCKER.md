# 🐳 Deployment 100% GRATUITO con Docker

Guía completa para publicar tu aplicación en internet **SIN PAGAR NADA** usando Docker.

---

## 🎯 Opciones 100% Gratuitas

| Plataforma | Frontend | Backend | Base de Datos | Limitaciones |
|------------|----------|---------|---------------|--------------|
| **Render.com** | ✅ | ✅ Docker | ❌ | 750 hrs/mes, duerme tras 15 min |
| **Fly.io** | ✅ | ✅ Docker | ✅ Postgres | 3 VMs, 3GB storage |
| **Koyeb** | ✅ | ✅ Docker | ❌ | 1 app, duerme tras 30 min |
| **Vercel + Render** | ✅ | ✅ Docker | Externo | Combinado |

**Recomendación: Fly.io** → Todo incluido, más generoso

---

## 🚀 Opción 1: Fly.io (MÁS COMPLETA - 100% GRATIS)

### ✅ Incluye:
- ✅ Frontend y Backend con Docker
- ✅ PostgreSQL incluido (1GB)
- ✅ 3 VMs compartidas
- ✅ SSL automático
- ✅ Sin tarjeta de crédito (opcional)

### 📦 Paso 1: Instalar Fly CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 🔐 Paso 2: Crear Cuenta y Login

```bash
flyctl auth signup
# o si ya tienes cuenta:
flyctl auth login
```

### 🗄️ Paso 3: Crear Base de Datos PostgreSQL (GRATIS)

```bash
# Crear app de base de datos
flyctl postgres create \
  --name clinica-db \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1

# Guardar el connection string que aparece
# Algo como: postgres://usuario:pass@clinica-db.internal:5432/clinica_db
```

### ⚙️ Paso 4: Desplegar Backend

```bash
cd backend/ClinicaAPI

# Crear app Fly
flyctl launch \
  --name clinica-api \
  --region mia \
  --no-deploy

# Configurar variables de entorno
flyctl secrets set \
  ConnectionStrings__DefaultConnection="postgres://..." \
  Jwt__SecretKey="TuClaveSecretaSegura64Caracteres" \
  ASPNETCORE_ENVIRONMENT="Production"

# Desplegar
flyctl deploy

# Tu API estará en: https://clinica-api.fly.dev
```

**Archivo `fly.toml` generado:**
```toml
app = "clinica-api"
primary_region = "mia"

[build]
  dockerfile = "Dockerfile"

[env]
  ASPNETCORE_URLS = "http://+:8080"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80
    force_https = true

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### 🎨 Paso 5: Desplegar Frontend

**Opción A: Frontend también en Fly.io**

```bash
cd frontend

# Crear app
flyctl launch \
  --name clinica-frontend \
  --region mia \
  --no-deploy

# Configurar variable de entorno
flyctl secrets set VITE_API_URL="https://clinica-api.fly.dev/api"

# Desplegar
flyctl deploy

# Tu frontend estará en: https://clinica-frontend.fly.dev
```

**Opción B: Frontend en Vercel (más rápido)**

```bash
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar en vercel.com:
# VITE_API_URL = https://clinica-api.fly.dev/api
```

### 📊 Paso 6: Migrar Base de Datos

```bash
# Conectarse a la base de datos
flyctl postgres connect -a clinica-db

# Dentro de PostgreSQL, crear tablas (adaptar scripts SQL)
```

**Alternativa: Convertir scripts SQL Server a PostgreSQL**

Usa esta herramienta online: https://www.sqlines.com/online

O crea migraciones en EF Core:
```bash
# En backend/ClinicaAPI
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🎨 Opción 2: Render.com (MÁS SIMPLE - GRATIS)

### ✅ Incluye:
- ✅ Backend con Docker gratis
- ✅ Frontend estático gratis
- ⚠️ BD externa requerida

### 📝 Paso 1: Crear Cuenta

1. Ve a [render.com](https://render.com)
2. Sign up con GitHub (GRATIS, sin tarjeta)

### 🗄️ Paso 2: Base de Datos Externa (Elige una)

**A) Neon.tech (PostgreSQL - GRATIS)**
```bash
# 1. Registrarse en neon.tech
# 2. Crear proyecto
# 3. Copiar connection string
# postgres://user:pass@ep-xxx.neon.tech/neondb
```

**B) Supabase (PostgreSQL - GRATIS)**
```bash
# 1. Registrarse en supabase.com
# 2. New project
# 3. Settings → Database → Connection string
```

**C) PlanetScale (MySQL - GRATIS, requiere adaptar código)**

### ⚙️ Paso 3: Desplegar Backend en Render

1. **New → Web Service**
2. **Connect repository** (tu GitHub)
3. **Configurar:**
   ```
   Name: clinica-backend
   Environment: Docker
   Dockerfile Path: backend/ClinicaAPI/Dockerfile
   Instance Type: Free
   ```
4. **Environment Variables:**
   ```
   ConnectionStrings__DefaultConnection = [tu connection string]
   Jwt__SecretKey = [clave segura 64 chars]
   ASPNETCORE_ENVIRONMENT = Production
   ```
5. **Create Web Service**

**URL:** `https://clinica-backend.onrender.com`

### 🎨 Paso 4: Desplegar Frontend en Render

1. **New → Static Site**
2. **Connect repository**
3. **Configurar:**
   ```
   Name: clinica-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
4. **Environment Variables:**
   ```
   VITE_API_URL = https://clinica-backend.onrender.com/api
   ```
5. **Create Static Site**

**URL:** `https://clinica-frontend.onrender.com`

---

## 🌐 Opción 3: Koyeb (ALTERNATIVA GRATIS)

### Paso 1: Registrarse
```bash
# Ir a koyeb.com y crear cuenta gratis
```

### Paso 2: Deploy con Docker
1. **Create App**
2. **Docker → GitHub**
3. **Seleccionar repo**
4. **Dockerfile path:** `backend/ClinicaAPI/Dockerfile`
5. **Instance:** Eco (Free)

---

## 🔧 Configuración de PostgreSQL

### Cambiar de SQL Server a PostgreSQL en el código

**1. Actualizar `ClinicaAPI.csproj`:**

```xml
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
<!-- Remover:
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
-->
```

**2. Actualizar `Program.cs`:**

```csharp
// Cambiar de:
// builder.Services.AddDbContext<ClinicaDbContext>(options =>
//     options.UseSqlServer(connectionString));

// A:
builder.Services.AddDbContext<ClinicaDbContext>(options =>
    options.UseNpgsql(connectionString));
```

**3. Ejecutar:**

```bash
cd backend/ClinicaAPI
dotnet restore
dotnet ef migrations add InitialPostgreSQL
dotnet ef database update
```

---

## 📊 Comparativa de Opciones Gratuitas

### Fly.io ⭐ (RECOMENDADO)
- ✅ **Todo incluido**: Frontend, Backend, BD
- ✅ **Más recursos**: 3 VMs, 3GB storage
- ✅ **Sin hibernación automática**
- ✅ **PostgreSQL incluido**
- ⚠️ Requiere tarjeta (no se cobra en tier gratuito)

### Render.com
- ✅ **Muy simple**
- ✅ **Sin tarjeta de crédito**
- ⚠️ **Hiberna tras 15 min de inactividad**
- ⚠️ **BD externa requerida**
- ⚠️ **750 horas/mes** (suficiente para 1 app)

### Vercel (Frontend) + Render (Backend)
- ✅ **Mejor frontend** (más rápido)
- ✅ **Sin hibernación en frontend**
- ⚠️ **Backend hiberna**
- ⚠️ **BD externa requerida**

---

## 🗄️ Bases de Datos Gratuitas

| Proveedor | Tipo | Storage | Limitaciones |
|-----------|------|---------|--------------|
| **Neon.tech** | PostgreSQL | 3GB | Hiberna tras 5 min inactividad |
| **Supabase** | PostgreSQL | 500MB | 2 proyectos, pausado tras 7 días |
| **PlanetScale** | MySQL | 5GB | 1 billón lecturas/mes |
| **MongoDB Atlas** | MongoDB | 512MB | 1 cluster compartido |
| **Fly.io Postgres** | PostgreSQL | 1GB | Con cuenta Fly.io |

---

## 🚀 Comandos Docker Locales

### Probar localmente antes de desplegar:

```bash
# Construir y ejecutar todo
docker-compose up --build

# Acceder:
# Frontend: http://localhost
# Backend: http://localhost:8080
# Base de datos: localhost:5432
```

### Comandos útiles:

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reconstruir solo un servicio
docker-compose up --build backend

# Parar todo
docker-compose down

# Limpiar volúmenes (borra BD)
docker-compose down -v
```

---

## 🔒 Variables de Entorno para Producción

### Generar clave JWT segura:
```bash
openssl rand -base64 64
```

### Backend (Fly.io/Render):
```bash
ConnectionStrings__DefaultConnection=postgres://user:pass@host:5432/db
Jwt__SecretKey=TU_CLAVE_GENERADA_DE_64_CARACTERES
Jwt__Issuer=https://tu-api.fly.dev
Jwt__Audience=https://tu-frontend.vercel.app
ASPNETCORE_ENVIRONMENT=Production
```

### Frontend:
```bash
VITE_API_URL=https://tu-backend.fly.dev/api
```

---

## ✅ Checklist Deployment Gratuito

- [ ] Código en GitHub
- [ ] Dockerfiles creados
- [ ] PostgreSQL configurado en el código
- [ ] Base de datos creada (Fly.io/Neon/Supabase)
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado en backend
- [ ] Migraciones ejecutadas
- [ ] Probado en producción
- [ ] Datos de prueba cargados

---

## 🆘 Solución de Problemas

### Backend no inicia
```bash
# Ver logs en Fly.io
flyctl logs -a clinica-api

# Ver logs en Render
# Click en tu servicio → Logs
```

### Error de conexión a BD
1. Verificar connection string
2. Verificar que la BD acepte conexiones externas
3. Verificar firewall/whitelist

### Frontend no se conecta al backend
1. Verificar CORS en `Program.cs`
2. Verificar `VITE_API_URL` en frontend
3. Verificar que backend esté activo

### Render hiberna la app
- Solución: Usar un servicio de "ping" gratuito como:
  - **UptimeRobot** (gratis) - hace ping cada 5 min
  - **Cron-job.org** (gratis) - llama a tu API periódicamente

---

## 💰 Resumen de Costos

| Componente | Plataforma | Costo |
|------------|-----------|-------|
| Frontend | Vercel/Render | **$0** |
| Backend Docker | Fly.io/Render | **$0** |
| PostgreSQL | Neon/Supabase | **$0** |
| SSL/HTTPS | Incluido | **$0** |
| **TOTAL** | | **$0/mes** |

---

## 🎯 Recomendación Final

**Para desarrollo/pruebas:**
```
✅ Render.com (Frontend + Backend)
✅ Neon.tech (PostgreSQL)
Total: $0/mes
Limitación: Hiberna tras 15 min
```

**Para proyecto más serio (pero gratis):**
```
✅ Fly.io (Frontend + Backend + BD)
Total: $0/mes
Limitación: Recursos limitados pero sin hibernación
Requiere: Tarjeta (no se cobra)
```

**Mix óptimo:**
```
✅ Vercel (Frontend) - Nunca hiberna
✅ Render (Backend Docker) - Hiberna pero reinicia rápido
✅ Neon (PostgreSQL) - Hiberna pero reconecta automático
Total: $0/mes
```

---

## 📞 Enlaces Útiles

- **Fly.io Docs**: https://fly.io/docs/
- **Render Docs**: https://render.com/docs
- **Neon.tech**: https://neon.tech
- **Supabase**: https://supabase.com
- **Docker Hub**: https://hub.docker.com

---

**¡Tu aplicación estará online 100% GRATIS en 30 minutos!** 🎉

La desventaja del tier gratuito es que puede haber latencia inicial si la app hiberna, pero es perfecto para demos, portafolio y proyectos personales.
