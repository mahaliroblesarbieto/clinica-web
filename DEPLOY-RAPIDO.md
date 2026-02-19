# 🚀 Deployment Rápido - 100% GRATIS

Tu proyecto está **LISTO PARA PRODUCCIÓN** con Docker y PostgreSQL.

---

## ✅ Cambios Realizados

- ✅ Backend configurado para PostgreSQL
- ✅ Scripts de base de datos PostgreSQL creados
- ✅ Dockerfiles optimizados
- ✅ Docker Compose para desarrollo local
- ✅ Configuración de producción lista

---

## 🎯 Elige Tu Opción (Todas GRATIS)

### 🥇 **Opción 1: Fly.io** (Recomendada - TODO incluido)

**Lo mejor:** Base de datos incluida, sin hibernación

```bash
# 1. Instalar Fly CLI
brew install flyctl  # macOS
# o visita: https://fly.io/docs/hands-on/install-flyctl/

# 2. Login
flyctl auth signup  # o flyctl auth login

# 3. Crear base de datos PostgreSQL
flyctl postgres create --name clinica-db --region mia

# 4. Desplegar Backend
cd backend/ClinicaAPI
flyctl launch --name clinica-api --region mia
flyctl secrets set ConnectionStrings__DefaultConnection="[connection string de postgres]"
flyctl secrets set Jwt__SecretKey="$(openssl rand -base64 64)"
flyctl deploy

# 5. Desplegar Frontend
cd ../../frontend
flyctl launch --name clinica-frontend --region mia
flyctl secrets set VITE_API_URL="https://clinica-api.fly.dev/api"
flyctl deploy

# URLs finales:
# Frontend: https://clinica-frontend.fly.dev
# Backend: https://clinica-api.fly.dev
```

---

### 🥈 **Opción 2: Render + Neon** (SIN tarjeta)

**Lo mejor:** No requiere tarjeta de crédito

#### A) Base de Datos en Neon.tech

1. **Ir a [neon.tech](https://neon.tech)** → Sign up
2. **Create Project** → Copiar connection string
   ```
   postgres://usuario:pass@ep-xxx.neon.tech/neondb
   ```

#### B) Backend en Render

1. **Ir a [render.com](https://render.com)** → Sign up con GitHub
2. **New → Web Service**
3. **Conectar tu repositorio GitHub**
4. **Configurar:**
   ```
   Name: clinica-backend
   Environment: Docker
   Dockerfile Path: backend/ClinicaAPI/Dockerfile
   Instance Type: Free
   ```
5. **Variables de entorno:**
   ```
   ConnectionStrings__DefaultConnection = [tu connection string de Neon]
   Jwt__SecretKey = [genera con: openssl rand -base64 64]
   ASPNETCORE_ENVIRONMENT = Production
   Jwt__Issuer = https://clinica-backend.onrender.com
   Jwt__Audience = https://clinica-frontend.onrender.com
   ```

#### C) Frontend en Render

1. **New → Static Site**
2. **Conectar repositorio**
3. **Configurar:**
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
4. **Variable de entorno:**
   ```
   VITE_API_URL = https://clinica-backend.onrender.com/api
   ```

**URLs finales:**
- Frontend: `https://clinica-frontend.onrender.com`
- Backend: `https://clinica-backend.onrender.com`

---

### 🥉 **Opción 3: Vercel + Render** (Mix óptimo)

**Lo mejor:** Frontend ultra rápido (nunca hiberna)

#### A) Base de Datos
- Igual que Opción 2 (Neon.tech)

#### B) Backend
- Igual que Opción 2 (Render)

#### C) Frontend en Vercel

```bash
cd frontend
npm install -g vercel
vercel --prod

# Configurar en vercel.com:
# VITE_API_URL = https://clinica-backend.onrender.com/api
```

---

## 💻 Probar Localmente Primero

```bash
# 1. Asegúrate de tener Docker instalado
docker --version

# 2. Ejecutar todo
docker-compose up --build

# 3. Acceder:
# - Frontend: http://localhost
# - Backend: http://localhost:8080/swagger
# - PostgreSQL: localhost:5432
```

---

## 🗄️ Migrar Base de Datos

Una vez desplegado, conectarte y crear las tablas:

### Para Fly.io:
```bash
# Conectar a la base de datos
flyctl postgres connect -a clinica-db

# Dentro de psql, pegar el contenido de:
\i database/postgres/02_CreateTables.sql
\i database/postgres/03_SeedData.sql
```

### Para Neon/Supabase:
1. Abrir el dashboard web
2. Query Editor o SQL Editor
3. Copiar y pegar:
   - `database/postgres/02_CreateTables.sql`
   - `database/postgres/03_SeedData.sql`

---

## 🔐 Generar Clave JWT Segura

```bash
openssl rand -base64 64
```

Usa el resultado como `Jwt__SecretKey`

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Base de datos PostgreSQL creada
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] Variables de entorno configuradas
- [ ] Tablas creadas en PostgreSQL
- [ ] Datos de prueba insertados
- [ ] Probado login y registro
- [ ] Probado agendamiento de citas

---

## 🎯 Recomendación

**Si tienes tarjeta:** → **Fly.io** (no se cobra, mejor experiencia)
**Sin tarjeta:** → **Render + Neon** (100% gratis, sin pedir nada)

---

## 🆘 Problemas Comunes

### Error: "Cannot connect to database"
```bash
# Verificar connection string
# Debe ser para PostgreSQL:
Host=xxx;Database=xxx;Username=xxx;Password=xxx
```

### Backend hiberna (Render)
**Solución:**
1. Ir a [uptimerobot.com](https://uptimerobot.com) (gratis)
2. Crear monitor HTTP
3. URL: `https://clinica-backend.onrender.com/health`
4. Intervalo: 5 minutos

### Frontend no conecta con backend
**Solución:**
1. Verificar `VITE_API_URL` en variables de entorno
2. Verificar CORS en `Program.cs`
3. Asegurar que backend está activo

---

## 📞 Soporte

- **Fly.io**: https://fly.io/docs
- **Render**: https://render.com/docs
- **Neon**: https://neon.tech/docs
- **Vercel**: https://vercel.com/docs

---

## 💰 Costo Total

### Opción 1 (Fly.io): **$0/mes**
### Opción 2 (Render + Neon): **$0/mes**
### Opción 3 (Vercel + Render + Neon): **$0/mes**

**¡Todo 100% GRATIS!** 🎉

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `docs/DEPLOY-GRATIS-DOCKER.md` - Guía detallada con todos los comandos
- `docs/DEPLOYMENT.md` - Todas las opciones de deployment
- `docs/INSTALACION.md` - Setup local

**Tu aplicación estará online en 20-30 minutos** ⚡
