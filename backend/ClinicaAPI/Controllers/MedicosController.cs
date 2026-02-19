using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using ClinicaAPI.DTOs;
using ClinicaAPI.Services;

namespace ClinicaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowFrontend")]
public class MedicosController : ControllerBase
{
    private readonly IMedicosService _medicosService;

    public MedicosController(IMedicosService medicosService)
    {
        _medicosService = medicosService;
    }

    [HttpPost("buscar")]
    public async Task<IActionResult> BuscarMedicos([FromBody] BuscarMedicosRequest request)
    {
        var medicos = await _medicosService.BuscarMedicos(request);
        return Ok(medicos);
    }

    [HttpGet("{medicoId}")]
    public async Task<IActionResult> GetMedico(int medicoId)
    {
        var medico = await _medicosService.GetMedicoById(medicoId);

        if (medico == null)
            return NotFound(new { message = "Médico no encontrado" });

        return Ok(medico);
    }

    [HttpGet("especialidades")]
    public async Task<IActionResult> GetEspecialidades()
    {
        var especialidades = await _medicosService.GetEspecialidades();
        return Ok(especialidades);
    }

    [HttpGet("sedes")]
    public async Task<IActionResult> GetSedes()
    {
        var sedes = await _medicosService.GetSedes();
        return Ok(sedes);
    }

    [HttpGet("{medicoId}/horarios")]
    public async Task<IActionResult> GetHorarios(int medicoId, [FromQuery] int sedeId, [FromQuery] DateTime fecha)
    {
        var horarios = await _medicosService.GetHorariosDisponibles(medicoId, sedeId, fecha);
        return Ok(horarios);
    }
}
