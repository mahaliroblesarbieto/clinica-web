using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicaAPI.DTOs;
using ClinicaAPI.Services;

namespace ClinicaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CitasController : ControllerBase
{
    private readonly ICitasService _citasService;

    public CitasController(ICitasService citasService)
    {
        _citasService = citasService;
    }

    [HttpGet("paciente/{pacienteId}")]
    public async Task<IActionResult> GetCitasByPaciente(int pacienteId)
    {
        var citas = await _citasService.GetCitasByPaciente(pacienteId);
        return Ok(citas);
    }

    [HttpGet("medico/{medicoId}")]
    public async Task<IActionResult> GetCitasByMedico(int medicoId)
    {
        var citas = await _citasService.GetCitasByMedico(medicoId);
        return Ok(citas);
    }

    [HttpGet("{citaId}")]
    public async Task<IActionResult> GetCita(int citaId)
    {
        var cita = await _citasService.GetCitaById(citaId);

        if (cita == null)
            return NotFound(new { message = "Cita no encontrada" });

        return Ok(cita);
    }

    [HttpGet("proximas/{pacienteId}")]
    public async Task<IActionResult> GetCitasProximas(int pacienteId)
    {
        var citas = await _citasService.GetCitasProximas(pacienteId);
        return Ok(citas);
    }

    [HttpGet("historial/{pacienteId}")]
    public async Task<IActionResult> GetHistorial(int pacienteId)
    {
        var citas = await _citasService.GetHistorialCitas(pacienteId);
        return Ok(citas);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCita([FromBody] CrearCitaRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var cita = await _citasService.CrearCita(request);

        if (cita == null)
            return BadRequest(new { message = "No se pudo crear la cita. Verifique la disponibilidad." });

        return CreatedAtAction(nameof(GetCita), new { citaId = cita.CitaID }, cita);
    }

    [HttpPut("{citaId}/estado")]
    public async Task<IActionResult> ActualizarEstado(int citaId, [FromBody] ActualizarEstadoCitaRequest request)
    {
        var resultado = await _citasService.ActualizarEstadoCita(citaId, request.NuevoEstado);

        if (!resultado)
            return NotFound(new { message = "Cita no encontrada" });

        return Ok(new { message = "Estado actualizado correctamente" });
    }

    [HttpDelete("{citaId}")]
    public async Task<IActionResult> CancelarCita(int citaId)
    {
        var resultado = await _citasService.CancelarCita(citaId);

        if (!resultado)
            return NotFound(new { message = "Cita no encontrada" });

        return Ok(new { message = "Cita cancelada correctamente" });
    }
}
