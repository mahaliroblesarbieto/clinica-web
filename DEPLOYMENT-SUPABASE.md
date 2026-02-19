# 🚀 Deployment con Supabase - Paso a Paso

Guía completa para desplegar tu aplicación usando **Supabase** (base de datos) + **Render** (backend) + **Vercel** (frontend).

**100% GRATUITO - Sin tarjeta de crédito**

---

## 📋 Resumen del Stack

```
Frontend → Vercel (GRATIS)
Backend → Render (GRATIS con hibernación)
Base de Datos → Supabase PostgreSQL (500MB GRATIS)
Watson → IBM Cloud (10k msgs/mes GRATIS)
```

---

## 🗄️ PASO 1: Base de Datos en Supabase (10 min)

### 1.1 Crear Cuenta

1. **Ir a [supabase.com](https://supabase.com)**
2. **Sign up** (con GitHub es más rápido)
3. **Verificar email**

### 1.2 Crear Proyecto

1. **Click "New Project"**
2. **Configurar:**
   ```
   Name: clinica-medica
   Database Password: [genera una contraseña segura]
   Region: South America (sao-paulo) o US East
   ```
3. **Click "Create new project"** (tarda 2-3 minutos)

### 1.3 Obtener Connection String

1. **En el dashboard → Settings → Database**
2. **Copiar "Connection String" (URI)**
   ```
   postgresql://postgres.[proyecto]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
3. **Reemplazar `[password]` con tu contraseña**
4. **GUARDAR ESTE STRING** - lo necesitarás

### 1.4 Crear Tablas

1. **En el dashboard → SQL Editor**
2. **Click "New Query"**
3. **Copiar y pegar el contenido de:**
   - `database/postgres/02_CreateTables.sql`
4. **Click "Run"** ✅
5. **Repetir con:**
   - `database/postgres/03_SeedData.sql`
6. **Click "Run"** ✅

### 1.5 Verificar Tablas Creadas

1. **En el dashboard → Table Editor**
2. **Deberías ver:**
   - Usuarios
   - Especialidades
   - Medicos
   - Sedes
   - Citas
   - HorariosDisponibles
   - MedicosSedes
   - Notificaciones
   - HistorialMedico
   - Resenas

✅ **Base de datos lista**

---

## ⚙️ PASO 2: Backend en Render (15 min)

### 2.1 Preparar Código

**IMPORTANTE:** Subir código a GitHub primero

```bash
cd /Users/mahali/Documents/WEB-CLINICA

# Inicializar git si no lo has hecho
git init

# Agregar archivos
git add .
git commit -m "App lista para producción con Watson Assistant"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/clinica-medica.git
git branch -M main
git push -u origin main
```

### 2.2 Crear Cuenta en Render

1. **Ir a [render.com](https://render.com)**
2. **Sign up con GitHub** (automático)
3. **Autorizar Render** a acceder a tus repos

### 2.3 Desplegar Backend

1. **En Render Dashboard → New → Web Service**

2. **Conectar tu repositorio:**
   - Buscar "clinica-medica"
   - Click "Connect"

3. **Configurar:**
   ```
   Name: clinica-backend
   Environment: Docker
   Branch: main
   Dockerfile Path: backend/ClinicaAPI/Dockerfile
   Docker Build Context Directory: backend/ClinicaAPI
   ```

4. **Plan:** Seleccionar **Free**

5. **Environment Variables** (Click "Add Environment Variable"):

   ```bash
   # Connection String de Supabase
   ConnectionStrings__DefaultConnection=postgresql://postgres.[tu-proyecto]:[password]@...

   # JWT (genera una clave segura)
   Jwt__SecretKey=TuClaveSecretaMuySeguraDeAlMenos64CaracteresPorFavorCambiar2024
   Jwt__Issuer=https://clinica-backend.onrender.com
   Jwt__Audience=https://tu-frontend.vercel.app
   Jwt__ExpirationMinutes=1440

   # Entorno
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:8080

   # Watson (si ya lo configuraste)
   Watson__ApiKey=tu_watson_api_key
   Watson__AssistantId=tu_assistant_id
   Watson__Url=https://api.us-south.assistant.watson.cloud.ibm.com
   Watson__Version=2021-11-27
   ```

6. **Click "Create Web Service"**

7. **ESPERAR** (5-10 minutos primera vez)
   - Ver logs en tiempo real
   - Cuando veas "Now listening on: http://[::]:8080" → ✅ Listo

8. **Copiar tu URL:**
   ```
   https://clinica-backend.onrender.com
   ```

### 2.4 Verificar Backend

1. **Abrir:** `https://clinica-backend.onrender.com/swagger`
2. **Deberías ver** la documentación de la API Swagger
3. **Probar endpoint:** `/api/Medicos/especialidades`

✅ **Backend funcionando**

---

## 🎨 PASO 3: Frontend en Vercel (10 min)

### 3.1 Preparar Variables de Entorno

Crea `frontend/.env.production` con:

```env
VITE_API_URL=https://clinica-backend.onrender.com/api

# Watson (opcional)
VITE_WATSON_INTEGRATION_ID=tu_integration_id
VITE_WATSON_REGION=us-south
VITE_WATSON_SERVICE_INSTANCE_ID=tu_service_instance_id
VITE_WATSON_CLIENT_VERSION=latest
```

**Commit y push:**
```bash
git add frontend/.env.production
git commit -m "Add production env"
git push
```

### 3.2 Desplegar en Vercel

**Opción A: Con Vercel CLI (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name? clinica-frontend
# - Directory? ./ (current)
# - Override settings? No
```

**Opción B: Con Dashboard Web**

1. **Ir a [vercel.com](https://vercel.com)**
2. **Sign up con GitHub**
3. **New Project**
4. **Import tu repo "clinica-medica"**
5. **Configurar:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. **Environment Variables:**
   ```
   VITE_API_URL=https://clinica-backend.onrender.com/api
   ```
7. **Deploy**

### 3.3 Obtener URL

Vercel te dará una URL:
```
https://clinica-frontend.vercel.app
```

O tu dominio personalizado si configuraste uno.

✅ **Frontend desplegado**

---

## 🔗 PASO 4: Conectar Todo (5 min)

### 4.1 Actualizar CORS en Backend

1. **En Render → clinica-backend → Environment**
2. **Agregar variable:**
   ```
   Cors__AllowedOrigins__0=https://clinica-frontend.vercel.app
   Cors__AllowedOrigins__1=https://tu-dominio.com
   ```
3. **Save Changes**
4. **Backend se redeployará automáticamente**

### 4.2 Actualizar Frontend con URL Real

Si usaste un dominio diferente:

1. **En Vercel → clinica-frontend → Settings → Environment Variables**
2. **Editar `VITE_API_URL`:**
   ```
   https://clinica-backend.onrender.com/api
   ```
3. **Redeploy** (Deployments → ... → Redeploy)

---

## ✅ PASO 5: Verificar Todo Funciona

### 5.1 Probar Frontend

1. **Abrir:** `https://clinica-frontend.vercel.app`
2. **Deberías ver:** Página de login
3. **Click "Registrarse"**
4. **Crear cuenta de prueba**

### 5.2 Probar Funcionalidades

1. **Registrarse** ✓
2. **Iniciar sesión** ✓
3. **Ver dashboard** ✓
4. **Agendar cita** ✓
5. **Chat Watson** (botón flotante) ✓

### 5.3 Si algo no funciona

**Backend no responde:**
- Esperar 30-60 seg (Render hiberna en tier gratuito)
- Ver logs en Render Dashboard

**CORS errors:**
- Verificar variables `Cors__AllowedOrigins` en Render
- Verificar URL exacta del frontend

**Base de datos no conecta:**
- Verificar connection string en Render
- Probar conexión desde Supabase SQL Editor

---

## 🎯 PASO 6: Configurar Watson Assistant (Opcional, 15 min)

Si quieres el chatbot funcionando:

1. **Crear cuenta en [IBM Cloud](https://cloud.ibm.com/registration)**
2. **Crear Watson Assistant** (Plan Lite - Gratis)
3. **Obtener credenciales** (API Key, Assistant ID, etc.)
4. **Agregar en Render:**
   ```
   Watson__ApiKey=...
   Watson__AssistantId=...
   ```
5. **Agregar en Vercel:**
   ```
   VITE_WATSON_INTEGRATION_ID=...
   VITE_WATSON_REGION=us-south
   VITE_WATSON_SERVICE_INSTANCE_ID=...
   ```
6. **Redeploy ambos**

Ver guía completa: `docs/WATSON-ASSISTANT.md`

---

## 🔧 Configuraciones Adicionales

### Evitar Hibernación de Render (Opcional)

Render hiberna tu app después de 15 min de inactividad.

**Solución: UptimeRobot (Gratis)**

1. **Ir a [uptimerobot.com](https://uptimerobot.com)**
2. **Sign up** (gratis)
3. **Add New Monitor:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Clinica Backend
   URL: https://clinica-backend.onrender.com/health
   Monitoring Interval: 5 minutes
   ```
4. **Create Monitor**

Ahora UptimeRobot hará ping cada 5 min y tu app nunca hibernará.

### Dominio Personalizado

**En Vercel:**
1. Settings → Domains
2. Add Domain
3. Seguir instrucciones DNS

**En Render:**
1. Settings → Custom Domain
2. Agregar dominio
3. Configurar CNAME

---

## 📊 Costos y Límites

### Supabase (Gratis)
- ✅ 500 MB base de datos
- ✅ 2 GB transferencia/mes
- ✅ 50,000 usuarios activos/mes
- ✅ 2 proyectos
- ⚠️ Pausa después de 7 días inactividad

### Render (Gratis)
- ✅ 750 horas/mes (suficiente para 1 app)
- ✅ 512 MB RAM
- ✅ Builds ilimitados
- ⚠️ Hiberna tras 15 min inactividad
- ⚠️ Arranque lento (30-60 seg)

### Vercel (Gratis)
- ✅ 100 GB bandwidth/mes
- ✅ Deployments ilimitados
- ✅ Builds instantáneos
- ✅ SSL automático
- ✅ CDN global

### Watson Assistant (Gratis)
- ✅ 10,000 mensajes/mes
- ✅ 5 asistentes
- ✅ NLP incluido

**Total: $0/mes** 🎉

---

## 🆘 Solución de Problemas Comunes

### Error: "Failed to build"

**Render:**
```bash
# Verificar Dockerfile path
# Debe ser: backend/ClinicaAPI/Dockerfile
```

### Error: "Connection refused"

**Supabase:**
```bash
# Verificar connection string
# Debe incluir password correcta
# Formato: postgresql://postgres.[proyecto]:[password]@...
```

### Error: "CORS policy"

**Render:**
```bash
# Agregar variables:
Cors__AllowedOrigins__0=https://clinica-frontend.vercel.app
Cors__AllowedOrigins__1=https://www.tu-dominio.com
```

### Frontend carga pero no conecta con backend

1. **Abrir DevTools (F12) → Network**
2. **Ver qué URL llama**
3. **Verificar `VITE_API_URL` en Vercel**
4. **Debe ser:** `https://clinica-backend.onrender.com/api`

### Backend tarda mucho en responder

**Normal en tier gratuito:**
- Primera llamada: 30-60 seg (está hibernando)
- Siguientes: <2 seg
- Solución: UptimeRobot (ver arriba)

---

## 📚 URLs de tu Aplicación

Después del deployment tendrás:

```
Frontend: https://clinica-frontend.vercel.app
Backend API: https://clinica-backend.onrender.com
Swagger: https://clinica-backend.onrender.com/swagger
Base de Datos: Supabase Dashboard
```

---

## 🎉 ¡Listo!

Tu aplicación está **ONLINE y PÚBLICA** en:
- ✅ Frontend accesible desde cualquier navegador
- ✅ Backend funcionando con API REST
- ✅ Base de datos PostgreSQL en la nube
- ✅ SSL/HTTPS automático
- ✅ 100% Gratuito

**Comparte tu URL con quien quieras:** 
`https://clinica-frontend.vercel.app`

---

## 📞 Recursos

- **Supabase Docs:** https://supabase.com/docs
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Watson Docs:** Ver `docs/WATSON-ASSISTANT.md`

---

## 🔄 Actualizar la Aplicación

Para hacer cambios y actualizar:

```bash
# 1. Hacer cambios en tu código local
# 2. Commit y push
git add .
git commit -m "Descripción de cambios"
git push

# Render redeployará automáticamente el backend
# Vercel redeployará automáticamente el frontend
```

---

**¡Felicitaciones! Tu aplicación está en producción** 🚀
