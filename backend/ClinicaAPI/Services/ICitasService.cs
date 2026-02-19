using ClinicaAPI.DTOs;

namespace ClinicaAPI.Services;

public interface ICitasService
{
    Task<List<CitaDTO>> GetCitasByPaciente(int pacienteId);
    Task<List<CitaDTO>> GetCitasByMedico(int medicoId);
    Task<CitaDTO?> GetCitaById(int citaId);
    Task<CitaDTO?> CrearCita(CrearCitaRequest request);
    Task<bool> ActualizarEstadoCita(int citaId, string nuevoEstado);
    Task<bool> CancelarCita(int citaId);
    Task<List<CitaDTO>> GetCitasProximas(int pacienteId);
    Task<List<CitaDTO>> GetHistorialCitas(int pacienteId);
}
