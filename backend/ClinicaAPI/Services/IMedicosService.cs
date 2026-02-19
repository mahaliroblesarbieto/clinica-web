using ClinicaAPI.DTOs;
using ClinicaAPI.Models;

namespace ClinicaAPI.Services;

public interface IMedicosService
{
    Task<List<MedicoDTO>> BuscarMedicos(BuscarMedicosRequest request);
    Task<MedicoDTO?> GetMedicoById(int medicoId);
    Task<List<Especialidad>> GetEspecialidades();
    Task<List<SedeDTO>> GetSedes();
    Task<List<HorarioDisponibleDTO>> GetHorariosDisponibles(int medicoId, int sedeId, DateTime fecha);
}
