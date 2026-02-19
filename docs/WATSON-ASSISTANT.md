# 🤖 Integración de Watson Assistant

Guía completa para configurar IBM Watson Assistant en tu sistema de gestión de citas médicas.

---

## 📋 ¿Qué es Watson Assistant?

IBM Watson Assistant es un chatbot con IA que permite:
- ✅ Responder preguntas frecuentes automáticamente
- ✅ Ayudar a agendar citas médicas
- ✅ Consultar información de especialidades
- ✅ Brindar soporte 24/7
- ✅ Procesamiento de lenguaje natural

---

## 🆓 Crear Cuenta Watson Assistant (GRATIS)

### Paso 1: Registro en IBM Cloud

1. **Ir a [IBM Cloud](https://cloud.ibm.com/registration)**
2. **Crear cuenta gratuita** (no requiere tarjeta)
3. **Verificar email**
4. **Login**

### Paso 2: Crear Instancia de Watson Assistant

1. **En IBM Cloud Dashboard:**
   - Click en **"Catalog"**
   - Buscar **"Watson Assistant"**
   - Click en **"Watson Assistant"**

2. **Configurar:**
   ```
   Plan: Lite (GRATIS)
   - 10,000 mensajes/mes
   - 5 assistants
   - Procesamiento básico de NLP
   
   Region: Dallas (us-south) o la más cercana
   Resource group: Default
   Service name: ClinicaAssistant
   ```

3. **Click "Create"**

### Paso 3: Configurar el Asistente

1. **En la página del servicio, click "Launch Watson Assistant"**

2. **Crear nuevo asistente:**
   ```
   Name: Asistente Clínica Médica
   Description: Chatbot para agendamiento de citas
   Language: Spanish
   ```

3. **Crear Dialog Skill:**
   - Click "Add dialog skill"
   - "Create skill"
   - Name: "Gestion Citas"

---

## 🎯 Configurar Intenciones (Intents)

### Intenciones Principales:

#### 1. **#agendar_cita**
Ejemplos de usuario:
```
- Quiero agendar una cita
- Necesito una consulta médica
- Deseo reservar una cita
- Quiero ver un doctor
- Me gustaría programar una cita
- Necesito cita con un cardiólogo
- Quiero agendar para pediatría
```

#### 2. **#consultar_citas**
Ejemplos:
```
- ¿Cuáles son mis citas?
- Mostrar mis citas programadas
- Ver mis próximas citas
- ¿Tengo citas agendadas?
- Consultar mi agenda
```

#### 3. **#cancelar_cita**
Ejemplos:
```
- Quiero cancelar mi cita
- Necesito cancelar una consulta
- Eliminar mi cita
- No podré asistir a mi cita
```

#### 4. **#especialidades**
Ejemplos:
```
- ¿Qué especialidades tienen?
- Mostrar especialidades médicas
- ¿Qué tipo de médicos hay?
- Quiero ver las especialidades
```

#### 5. **#horarios**
Ejemplos:
```
- ¿Qué horarios tienen?
- ¿Cuándo atienden?
- Horarios de atención
- ¿A qué hora abren?
```

#### 6. **#sedes**
Ejemplos:
```
- ¿Dónde están ubicados?
- Mostrar sedes
- ¿Qué clínicas tienen?
- Direcciones de las sedes
```

---

## 💬 Configurar Diálogos (Dialogs)

### Diálogo: Agendar Cita

```
Node: Agendar Cita
If assistant recognizes: #agendar_cita

Response:
¡Perfecto! Te ayudaré a agendar tu cita. 

¿Qué especialidad necesitas?
- Cardiología
- Pediatría  
- Dermatología
- Medicina General
- Ginecología
```

### Diálogo: Consultar Citas

```
Node: Consultar Citas
If assistant recognizes: #consultar_citas

Response:
Para consultar tus citas, por favor inicia sesión en tu cuenta.

[Botón: Ir a Mis Citas]
```

### Diálogo: Especialidades

```
Node: Especialidades
If assistant recognizes: #especialidades

Response:
Contamos con las siguientes especialidades:

🫀 Cardiología
👶 Pediatría
🩺 Medicina General
👩‍⚕️ Ginecología
🦴 Traumatología
🧠 Neurología
👁️ Oftalmología
🦷 Odontología

¿En cuál estás interesado?
```

---

## 🔧 Integración en el Proyecto

### 1. Obtener Credenciales

1. **En Watson Assistant:**
   - Settings → API Details
   - Copiar:
     - **API Key**
     - **Assistant ID**
     - **URL** (ej: https://api.us-south.assistant.watson.cloud.ibm.com)

2. **Para Web Chat:**
   - Integrations → Web Chat
   - Click "Create"
   - Copiar:
     - **Integration ID**
     - **Region**
     - **Service Instance ID**

### 2. Configurar Backend

Edita `backend/ClinicaAPI/appsettings.json`:

```json
{
  "Watson": {
    "ApiKey": "TU_API_KEY_AQUI",
    "AssistantId": "TU_ASSISTANT_ID_AQUI",
    "Url": "https://api.us-south.assistant.watson.cloud.ibm.com",
    "Version": "2021-11-27"
  }
}
```

### 3. Configurar Frontend

Crea `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api

# Watson Assistant
VITE_WATSON_INTEGRATION_ID=tu_integration_id
VITE_WATSON_REGION=us-south
VITE_WATSON_SERVICE_INSTANCE_ID=tu_service_instance_id
VITE_WATSON_CLIENT_VERSION=latest
```

### 4. Para Producción

En las variables de entorno de tu plataforma (Fly.io, Render, etc.):

**Backend:**
```bash
Watson__ApiKey=tu_api_key
Watson__AssistantId=tu_assistant_id
Watson__Url=https://api.us-south.assistant.watson.cloud.ibm.com
Watson__Version=2021-11-27
```

**Frontend:**
```bash
VITE_WATSON_INTEGRATION_ID=tu_integration_id
VITE_WATSON_REGION=us-south
VITE_WATSON_SERVICE_INSTANCE_ID=tu_service_instance_id
```

---

## 🎨 Personalizar el Chat

### En Watson Assistant Dashboard:

1. **Integrations → Web Chat → Customize**

2. **Appearance:**
   ```
   Primary color: #0066CC (azul de tu app)
   Secondary color: #FFFFFF
   Accent color: #0052A3
   ```

3. **Home screen:**
   ```
   Greeting: ¡Hola! Soy tu asistente virtual
   Conversation starters:
   - Agendar una cita
   - Ver especialidades
   - Horarios de atención
   - Ubicación de sedes
   ```

4. **Launcher:**
   ```
   Label: ¿Necesitas ayuda?
   Position: Bottom right
   ```

---

## 🧪 Probar la Integración

### Localmente:

```bash
# 1. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 2. Ejecutar backend
cd backend/ClinicaAPI
dotnet run

# 3. Ejecutar frontend
cd frontend
npm run dev

# 4. Abrir http://localhost:5173
# 5. Click en el botón flotante del chat
```

### Probar conversaciones:

```
Usuario: Hola
Bot: ¡Hola! Soy tu asistente virtual...

Usuario: Quiero agendar una cita
Bot: ¡Perfecto! Te ayudaré a agendar tu cita...

Usuario: ¿Qué especialidades tienen?
Bot: Contamos con las siguientes especialidades...
```

---

## 📊 Monitoreo y Analíticas

### En Watson Assistant:

1. **Analytics Dashboard**
   - Total de conversaciones
   - Intenciones más usadas
   - Mensajes no comprendidos
   - Satisfacción del usuario

2. **Mejorar el Asistente:**
   - Revisar "Unrecognized intents"
   - Agregar nuevos ejemplos
   - Refinar respuestas

---

## 💡 Funciones Avanzadas

### 1. Webhooks para Acciones

En `backend/ClinicaAPI/Controllers/WatsonController.cs` ya está configurado:

```csharp
[HttpPost("webhook")]
public async Task<IActionResult> Webhook([FromBody] JsonElement payload)
{
    // Detectar intención "agendar_cita"
    // Llamar a API de citas
    // Retornar datos al usuario
}
```

### 2. Context Variables

Guardar información del usuario:
```json
{
  "context": {
    "user_id": "123",
    "nombre": "Carlos",
    "especialidad_seleccionada": "Cardiología"
  }
}
```

### 3. Integración con Base de Datos

Watson puede llamar a tus endpoints:
```
Usuario: ¿Qué horarios tiene el Dr. Sánchez?
Watson → Webhook → Backend API → Database → Response
```

---

## 🚀 Deployment

### Watson Assistant en Producción:

1. **Ya está en la nube** (IBM Cloud)
2. **Solo necesitas las credenciales** en tus variables de entorno
3. **El plan Lite es suficiente** para comenzar (10k mensajes/mes)

### Escalado:

Si necesitas más:
```
Plan Lite: GRATIS (10k mensajes/mes)
Plan Plus: $140/mes (1M mensajes/mes)
Plan Enterprise: Personalizado
```

---

## ✅ Checklist de Integración

- [ ] Cuenta IBM Cloud creada
- [ ] Watson Assistant instancia creada
- [ ] Asistente configurado
- [ ] Intenciones creadas (#agendar_cita, #consultar_citas, etc.)
- [ ] Diálogos configurados
- [ ] Credenciales obtenidas
- [ ] Variables de entorno configuradas
- [ ] Componente WatsonChat integrado
- [ ] Backend WatsonController funcionando
- [ ] Probado localmente
- [ ] Desplegado en producción
- [ ] Monitoreo activado

---

## 🆘 Solución de Problemas

### Error: "Invalid credentials"
```bash
# Verificar API Key en appsettings.json
# Verificar que la región coincida
```

### Chat no aparece
```bash
# Verificar variables VITE_WATSON_* en .env
# Verificar que el script se cargue en Network tab
```

### "Assistant not found"
```bash
# Verificar ASSISTANT_ID correcto
# Verificar que el asistente esté publicado
```

---

## 📚 Recursos

- **Documentación oficial:** https://cloud.ibm.com/docs/watson-assistant
- **API Reference:** https://cloud.ibm.com/apidocs/assistant/assistant-v2
- **Web Chat SDK:** https://web-chat.global.assistant.watson.cloud.ibm.com/docs.html
- **Tutorial videos:** https://www.youtube.com/ibmwatson

---

## 💰 Costos

**Plan Lite (GRATIS):**
- ✅ 10,000 mensajes por mes
- ✅ 5 asistentes
- ✅ Todas las funciones básicas
- ✅ Sin tarjeta de crédito

**Suficiente para:**
- Proyectos pequeños/medianos
- Demos y prototipos
- MVPs

---

**¡Watson Assistant integrado y listo para usar!** 🤖✨

Tu chatbot ayudará a los usuarios a:
- Agendar citas 24/7
- Consultar información
- Navegar por la plataforma
- Obtener soporte instantáneo
