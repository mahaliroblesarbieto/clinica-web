using Microsoft.EntityFrameworkCore;
using ClinicaAPI.Data;
using ClinicaAPI.DTOs;
using ClinicaAPI.Models;

namespace ClinicaAPI.Services;

public class CitasService : ICitasService
{
    private readonly ClinicaDbContext _context;

    public CitasService(ClinicaDbContext context)
    {
        _context = context;
    }

    public async Task<List<CitaDTO>> GetCitasByPaciente(int pacienteId)
    {
        return await _context.Citas
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Usuario)
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
            .Include(c => c.Sede)
            .Where(c => c.PacienteID == pacienteId)
            .OrderByDescending(c => c.FechaCita)
            .Select(c => MapToDTO(c))
            .ToListAsync();
    }

    public async Task<List<CitaDTO>> GetCitasByMedico(int medicoId)
    {
        return await _context.Citas
            .Include(c => c.Paciente)
            .Include(c => c.Sede)
            .Where(c => c.MedicoID == medicoId)
            .OrderByDescending(c => c.FechaCita)
            .Select(c => MapToDTO(c))
            .ToListAsync();
    }

    public async Task<CitaDTO?> GetCitaById(int citaId)
    {
        var cita = await _context.Citas
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Usuario)
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
            .Include(c => c.Paciente)
            .Include(c => c.Sede)
            .FirstOrDefaultAsync(c => c.CitaID == citaId);

        return cita != null ? MapToDTO(cita) : null;
    }

    public async Task<CitaDTO?> CrearCita(CrearCitaRequest request)
    {
        var medicoExiste = await _context.Medicos.AnyAsync(m => m.MedicoID == request.MedicoID && m.Activo);
        var sedeExiste = await _context.Sedes.AnyAsync(s => s.SedeID == request.SedeID && s.Activo);

        if (!medicoExiste || !sedeExiste)
            return null;

        var citaExistente = await _context.Citas
            .AnyAsync(c => c.MedicoID == request.MedicoID 
                && c.FechaCita == request.FechaCita 
                && c.Estado != "Cancelada");

        if (citaExistente)
            return null;

        var totalPagar = (request.ValorConsulta ?? 0) - (request.ValorCobertura ?? 0);

        var cita = new Cita
        {
            PacienteID = request.PacienteID,
            MedicoID = request.MedicoID,
            SedeID = request.SedeID,
            FechaCita = request.FechaCita,
            TipoServicio = request.TipoServicio,
            MotivoConsulta = request.MotivoConsulta,
            ValorConsulta = request.ValorConsulta,
            ValorCobertura = request.ValorCobertura,
            TotalPagar = totalPagar,
            Estado = "Pendiente",
            FechaCreacion = DateTime.UtcNow
        };

        _context.Citas.Add(cita);
        await _context.SaveChangesAsync();

        // TODO: Reactivar notificaciones después de que el schema esté completamente sincronizado
        // var notificacion = new Notificacion
        // {
        //     UsuarioID = request.PacienteID,
        //     Mensaje = $"Tu cita ha sido agendada para el {request.FechaCita:dd/MM/yyyy HH:mm}",
        //     Tipo = "Confirmación",
        //     FechaCreacion = DateTime.UtcNow
        // };
        // _context.Notificaciones.Add(notificacion);
        // await _context.SaveChangesAsync();

        return await GetCitaById(cita.CitaID);
    }

    public async Task<bool> ActualizarEstadoCita(int citaId, string nuevoEstado)
    {
        var cita = await _context.Citas.FindAsync(citaId);
        if (cita == null)
            return false;

        cita.Estado = nuevoEstado;
        cita.FechaActualizacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelarCita(int citaId)
    {
        return await ActualizarEstadoCita(citaId, "Cancelada");
    }

    public async Task<List<CitaDTO>> GetCitasProximas(int pacienteId)
    {
        var ahora = DateTime.UtcNow;
        return await _context.Citas
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Usuario)
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
            .Include(c => c.Sede)
            .Where(c => c.PacienteID == pacienteId 
                && c.FechaCita >= ahora 
                && (c.Estado == "Pendiente" || c.Estado == "Confirmada"))
            .OrderBy(c => c.FechaCita)
            .Select(c => MapToDTO(c))
            .ToListAsync();
    }

    public async Task<List<CitaDTO>> GetHistorialCitas(int pacienteId)
    {
        var ahora = DateTime.UtcNow;
        return await _context.Citas
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Usuario)
            .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
            .Include(c => c.Sede)
            .Where(c => c.PacienteID == pacienteId 
                && (c.FechaCita < ahora || c.Estado == "Completada" || c.Estado == "Cancelada"))
            .OrderByDescending(c => c.FechaCita)
            .Select(c => MapToDTO(c))
            .ToListAsync();
    }

    private static CitaDTO MapToDTO(Cita cita)
    {
        return new CitaDTO
        {
            CitaID = cita.CitaID,
            PacienteID = cita.PacienteID,
            PacienteNombre = cita.Paciente?.NombreCompleto,
            MedicoID = cita.MedicoID,
            MedicoNombre = cita.Medico?.Usuario?.NombreCompleto,
            EspecialidadNombre = cita.Medico?.Especialidad?.Nombre,
            MedicoFoto = cita.Medico?.FotoURL,
            SedeID = cita.SedeID,
            SedeNombre = cita.Sede?.Nombre,
            SedeDireccion = cita.Sede?.Direccion,
            FechaCita = cita.FechaCita,
            TipoServicio = cita.TipoServicio,
            Estado = cita.Estado,
            MotivoConsulta = cita.MotivoConsulta,
            ValorConsulta = cita.ValorConsulta,
            ValorCobertura = cita.ValorCobertura,
            TotalPagar = cita.TotalPagar,
            FechaCreacion = cita.FechaCreacion
        };
    }
}
