using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ClinicaAPI.Data;
using ClinicaAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Construir connection string desde variables de entorno
var dbHost = builder.Configuration["DB_HOST"] ?? "localhost";
var dbName = builder.Configuration["DB_NAME"] ?? "postgres";
var dbUser = builder.Configuration["DB_USER"] ?? "postgres";
var dbPassword = builder.Configuration["DB_PASSWORD"] ?? "postgres";
var dbPort = builder.Configuration["DB_PORT"] ?? "5432";

var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

// Configurar Npgsql para aceptar DateTime sin timezone
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddDbContext<ClinicaDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICitasService, CitasService>();
builder.Services.AddScoped<IMedicosService, MedicosService>();

// Agregar HttpClient para Watson Assistant
builder.Services.AddHttpClient();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey)
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "*" };
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Habilitar Swagger en todos los entornos
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
