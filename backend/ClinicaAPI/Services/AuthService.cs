using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClinicaAPI.Data;
using ClinicaAPI.DTOs;
using ClinicaAPI.Models;
using BCrypt.Net;

namespace ClinicaAPI.Services;

public class AuthService : IAuthService
{
    private readonly ClinicaDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ClinicaDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.Activo);

        if (usuario == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            return null;

        usuario.UltimoAcceso = DateTime.Now;
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(usuario);

        return new LoginResponse
        {
            Token = token,
            UsuarioID = usuario.UsuarioID,
            NombreCompleto = usuario.NombreCompleto,
            Email = usuario.Email,
            TipoUsuario = usuario.TipoUsuario
        };
    }

    public async Task<LoginResponse?> Register(RegisterRequest request)
    {
        var existingUser = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
            return null;

        var usuario = new Usuario
        {
            NombreCompleto = request.NombreCompleto,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FechaNacimiento = request.FechaNacimiento,
            Telefono = request.Telefono,
            Direccion = request.Direccion,
            TipoUsuario = "Paciente",
            FechaRegistro = DateTime.Now,
            Activo = true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(usuario);

        return new LoginResponse
        {
            Token = token,
            UsuarioID = usuario.UsuarioID,
            NombreCompleto = usuario.NombreCompleto,
            Email = usuario.Email,
            TipoUsuario = usuario.TipoUsuario
        };
    }

    public async Task<Usuario?> GetUsuarioById(int id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.UsuarioID == id && u.Activo);
    }

    public string GenerateJwtToken(Usuario usuario)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioID.ToString()),
            new Claim(ClaimTypes.Name, usuario.NombreCompleto),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.TipoUsuario)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(jwtSettings["ExpirationMinutes"])),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(secretKey),
                SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
