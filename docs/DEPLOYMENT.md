# 🚀 Guía de Deployment - Publicación Web

Esta guía te ayudará a publicar tu sistema de gestión de citas médicas en producción para que sea accesible desde internet.

---

## 📋 Tabla de Contenidos

1. [Arquitectura de Deployment](#arquitectura-de-deployment)
2. [Opción 1: Azure (Recomendado)](#opción-1-azure-recomendado)
3. [Opción 2: AWS](#opción-2-aws)
4. [Opción 3: Hosting Económico Mixto](#opción-3-hosting-económico-mixto)
5. [Configuración de Producción](#configuración-de-producción)
6. [SSL/HTTPS](#sslhttps)
7. [Variables de Entorno](#variables-de-entorno)
8. [CI/CD](#cicd)

---

## 🏗️ Arquitectura de Deployment

```
Internet
    ↓
[CDN/Cloudflare] (Opcional)
    ↓
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  - Vercel / Netlify / Azure Static Web │
│  - https://tu-clinica.com              │
└─────────────────────────────────────────┘
    ↓ API calls
┌─────────────────────────────────────────┐
│  Backend (.NET API)                     │
│  - Azure App Service / AWS / Railway   │
│  - https://api.tu-clinica.com          │
└─────────────────────────────────────────┘
    ↓ Database connection
┌─────────────────────────────────────────┐
│  Base de Datos (SQL Server)            │
│  - Azure SQL / AWS RDS                 │
└─────────────────────────────────────────┘
```

---

## 🔷 Opción 1: Azure (Recomendado)

### Ventajas
- ✅ Integración nativa con .NET
- ✅ SQL Server nativo (Azure SQL)
- ✅ Escalabilidad automática
- ✅ $200 USD crédito gratuito inicial

### Costos Estimados
- Frontend: **GRATIS** (Azure Static Web Apps)
- Backend: **~$13-55/mes** (App Service B1)
- Base de Datos: **~$5-15/mes** (Azure SQL Basic)
- **Total: $18-70/mes**

### 1️⃣ Desplegar Base de Datos (Azure SQL)

```bash
# 1. Crear grupo de recursos
az group create --name clinica-rg --location eastus

# 2. Crear servidor SQL
az sql server create \
  --name clinica-sql-server \
  --resource-group clinica-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password "TuPassword123!"

# 3. Crear base de datos
az sql db create \
  --resource-group clinica-rg \
  --server clinica-sql-server \
  --name ClinicaMedicaDB \
  --service-objective Basic

# 4. Configurar firewall
az sql server firewall-rule create \
  --resource-group clinica-rg \
  --server clinica-sql-server \
  --name AllowAllAzureIPs \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

**Connection String:**
```
Server=tcp:clinica-sql-server.database.windows.net,1433;Database=ClinicaMedicaDB;User ID=sqladmin;Password=TuPassword123!;Encrypt=True;
```

### 2️⃣ Desplegar Backend (Azure App Service)

```bash
# 1. Crear App Service Plan
az appservice plan create \
  --name clinica-plan \
  --resource-group clinica-rg \
  --sku B1 \
  --is-linux

# 2. Crear Web App
az webapp create \
  --resource-group clinica-rg \
  --plan clinica-plan \
  --name clinica-api-backend \
  --runtime "DOTNET|8.0"

# 3. Configurar connection string
az webapp config connection-string set \
  --resource-group clinica-rg \
  --name clinica-api-backend \
  --settings DefaultConnection="Server=tcp:clinica-sql-server.database.windows.net..." \
  --connection-string-type SQLAzure

# 4. Desplegar código
cd backend/ClinicaAPI
dotnet publish -c Release -o ./publish
cd publish
zip -r publish.zip .
az webapp deployment source config-zip \
  --resource-group clinica-rg \
  --name clinica-api-backend \
  --src publish.zip
```

**URL del Backend:** `https://clinica-api-backend.azurewebsites.net`

### 3️⃣ Desplegar Frontend (Azure Static Web Apps)

```bash
# 1. Compilar frontend
cd frontend
npm run build

# 2. Crear Static Web App
az staticwebapp create \
  --name clinica-frontend \
  --resource-group clinica-rg \
  --source ./dist \
  --location "eastus2" \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist"
```

**Alternativa con GitHub Actions:**
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          output_location: "dist"
```

---

## 🟧 Opción 2: AWS

### 1️⃣ Base de Datos (AWS RDS SQL Server)

```bash
# Crear instancia RDS
aws rds create-db-instance \
  --db-instance-identifier clinica-db \
  --db-instance-class db.t3.micro \
  --engine sqlserver-ex \
  --master-username admin \
  --master-user-password YourPassword123! \
  --allocated-storage 20
```

**Costos:** ~$25-50/mes

### 2️⃣ Backend (AWS Elastic Beanstalk)

```bash
# Inicializar EB
cd backend/ClinicaAPI
eb init -p "64bit Amazon Linux 2 v2.5.0 running .NET Core" clinica-api

# Crear entorno
eb create clinica-api-prod

# Desplegar
dotnet publish -c Release
eb deploy
```

### 3️⃣ Frontend (AWS S3 + CloudFront)

```bash
# Compilar
cd frontend
npm run build

# Crear bucket S3
aws s3 mb s3://clinica-frontend

# Configurar como sitio web
aws s3 website s3://clinica-frontend \
  --index-document index.html \
  --error-document index.html

# Subir archivos
aws s3 sync dist/ s3://clinica-frontend --acl public-read

# Crear distribución CloudFront (CDN)
aws cloudfront create-distribution \
  --origin-domain-name clinica-frontend.s3.amazonaws.com
```

---

## 💰 Opción 3: Hosting Económico Mixto

### Configuración Más Barata (~$10-20/mes)

#### Frontend: **Vercel** (GRATIS)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desplegar
cd frontend
vercel --prod
```

**Configuración automática:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

#### Backend: **Railway.app** ($5-10/mes)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Iniciar proyecto
cd backend/ClinicaAPI
railway init

# 4. Desplegar
railway up
```

**Variables de entorno en Railway:**
```env
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=...
JWT__SecretKey=...
```

#### Base de Datos: **PlanetScale** (GRATIS tier) o **Azure SQL** ($5/mes)

**PlanetScale (MySQL - requiere cambios):**
- 5GB almacenamiento gratis
- 1 billón de lecturas/mes
- Compatible con Entity Framework Core

**Azure SQL Database (Serverless):**
```bash
az sql db create \
  --resource-group clinica-rg \
  --server clinica-sql-server \
  --name ClinicaMedicaDB \
  --compute-model Serverless \
  --edition GeneralPurpose \
  --family Gen5 \
  --min-capacity 0.5 \
  --max-capacity 1 \
  --auto-pause-delay 60
```
Costo: ~$5/mes (solo pagas cuando se usa)

---

## ⚙️ Configuración de Producción

### 1. Backend: `appsettings.Production.json`

Crea este archivo en `backend/ClinicaAPI/`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "#{ConnectionString}#"
  },
  "Jwt": {
    "SecretKey": "#{JwtSecretKey}#",
    "Issuer": "https://api.tu-clinica.com",
    "Audience": "https://tu-clinica.com",
    "ExpirationMinutes": 1440
  },
  "Cors": {
    "AllowedOrigins": [
      "https://tu-clinica.com",
      "https://www.tu-clinica.com"
    ]
  }
}
```

### 2. Frontend: Variables de Entorno

Crea `.env.production` en `frontend/`:

```env
VITE_API_URL=https://clinica-api-backend.azurewebsites.net/api
VITE_APP_NAME=Sistema de Citas Médicas
VITE_ENVIRONMENT=production
```

Actualiza `frontend/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.tu-clinica.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. Actualizar CORS en Backend

Edita `backend/ClinicaAPI/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins(
            "https://tu-clinica.com",
            "https://www.tu-clinica.com",
            "https://tu-clinica.vercel.app"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Más abajo en el código
app.UseCors("ProductionPolicy");
```

---

## 🔒 SSL/HTTPS

### Azure
- ✅ **SSL automático** en Static Web Apps y App Service
- Dominio custom: Agrega en portal Azure → Custom domains

### Vercel
- ✅ **SSL automático** con Let's Encrypt
- Dominio custom: Agregar en configuración del proyecto

### Certificado SSL Personalizado
Si usas tu propio servidor:

```bash
# Instalar Certbot
sudo apt-get install certbot

# Generar certificado
sudo certbot certonly --standalone -d api.tu-clinica.com
```

---

## 🌐 Configuración de Dominio

### 1. Comprar Dominio
- Namecheap, GoDaddy, Google Domains (~$10-15/año)

### 2. Configurar DNS

```
# Frontend
Type: A
Name: @
Value: [IP de Vercel/Azure]
TTL: 3600

# Backend API
Type: CNAME
Name: api
Value: clinica-api-backend.azurewebsites.net
TTL: 3600

# WWW
Type: CNAME
Name: www
Value: tu-clinica.com
TTL: 3600
```

---

## 🔐 Variables de Entorno Seguras

### Backend (Azure App Service)

```bash
# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group clinica-rg \
  --name clinica-api-backend \
  --settings \
    JWT__SecretKey="TuClaveSecretaMuySeguraYLargaDe64Caracteres2024!@#$" \
    ASPNETCORE_ENVIRONMENT="Production"
```

### Frontend (Vercel)

En el dashboard de Vercel:
1. Settings → Environment Variables
2. Agregar:
   - `VITE_API_URL` = `https://api.tu-clinica.com/api`

---

## 🔄 CI/CD con GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        run: dotnet restore
        working-directory: ./backend/ClinicaAPI
      
      - name: Build
        run: dotnet build --configuration Release --no-restore
        working-directory: ./backend/ClinicaAPI
      
      - name: Publish
        run: dotnet publish -c Release -o ./publish
        working-directory: ./backend/ClinicaAPI
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'clinica-api-backend'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./backend/ClinicaAPI/publish

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend
      
      - name: Build
        run: npm run build
        working-directory: ./frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## 📊 Resumen de Opciones

| Componente | Opción Barata | Opción Premium | Opción Intermedia |
|------------|---------------|----------------|-------------------|
| **Frontend** | Vercel (Gratis) | Azure Static Web Apps | Netlify (Gratis) |
| **Backend** | Railway ($5-10) | Azure App Service ($55) | Render ($7-25) |
| **Base de Datos** | PlanetScale (Gratis) | Azure SQL ($15+) | Azure SQL Serverless ($5) |
| **Total/mes** | **$5-10** | **$70-100** | **$20-35** |

---

## ✅ Checklist de Deployment

- [ ] Base de datos creada y migrada
- [ ] Connection string configurado
- [ ] Variables de entorno en producción
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado
- [ ] CI/CD pipeline funcionando
- [ ] Backups de base de datos configurados
- [ ] Monitoreo y logs habilitados
- [ ] Pruebas de funcionalidad en producción
- [ ] Credenciales de prueba actualizadas

---

## 🎯 Recomendación Final

**Para empezar (Mínimo costo):**
```
Frontend: Vercel (GRATIS)
Backend: Railway ($5-10/mes)
Base de Datos: Azure SQL Serverless ($5/mes)
Total: ~$10-15/mes
```

**Para producción seria:**
```
Todo en Azure con autoscaling y redundancia
Frontend: Azure Static Web Apps (GRATIS)
Backend: Azure App Service (B1 $13/mes)
Base de Datos: Azure SQL Basic ($5/mes)
Total: ~$18-20/mes
```

---

## 📞 Soporte

- **Azure**: [Portal Azure](https://portal.azure.com)
- **Vercel**: [Dashboard Vercel](https://vercel.com/dashboard)
- **Railway**: [Dashboard Railway](https://railway.app/dashboard)

¡Tu aplicación estará en internet en menos de 1 hora! 🚀
