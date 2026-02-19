# Etapa de construcción
FROM node:18-alpine AS build
WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remover archivos por defecto de nginx
RUN rm -rf ./*

# Copiar build de React
COPY --from=build /app/dist .

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
