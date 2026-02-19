using ClinicaAPI.DTOs;
using ClinicaAPI.Models;

namespace ClinicaAPI.Services;

public interface IAuthService
{
    Task<LoginResponse?> Login(LoginRequest request);
    Task<LoginResponse?> Register(RegisterRequest request);
    Task<Usuario?> GetUsuarioById(int id);
    string GenerateJwtToken(Usuario usuario);
}
