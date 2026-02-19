using Microsoft.AspNetCore.Mvc;
using ClinicaAPI.DTOs;
using ClinicaAPI.Services;

namespace ClinicaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _authService.Login(request);

        if (response == null)
            return Unauthorized(new { message = "Email o contraseña incorrectos" });

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _authService.Register(request);

        if (response == null)
            return BadRequest(new { message = "El email ya está registrado" });

        return Ok(response);
    }

    [HttpGet("usuario/{id}")]
    public async Task<IActionResult> GetUsuario(int id)
    {
        var usuario = await _authService.GetUsuarioById(id);

        if (usuario == null)
            return NotFound(new { message = "Usuario no encontrado" });

        return Ok(new
        {
            usuario.UsuarioID,
            usuario.NombreCompleto,
            usuario.Email,
            usuario.FechaNacimiento,
            usuario.Telefono,
            usuario.Direccion,
            usuario.TipoUsuario
        });
    }
}
