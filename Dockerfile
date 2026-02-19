# Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar csproj y restaurar dependencias
COPY backend/ClinicaAPI/ClinicaAPI.csproj ./
RUN dotnet restore

# Copiar todo el código y compilar
COPY backend/ClinicaAPI/ ./
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 443

# Copiar archivos publicados
COPY --from=build /app/publish .

# Configurar para producción
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ClinicaAPI.dll"]
