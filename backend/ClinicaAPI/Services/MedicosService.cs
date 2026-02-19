using Microsoft.EntityFrameworkCore;
using ClinicaAPI.Data;
using ClinicaAPI.DTOs;
using ClinicaAPI.Models;

namespace ClinicaAPI.Services;

public class MedicosService : IMedicosService
{
    private readonly ClinicaDbContext _context;

    public MedicosService(ClinicaDbContext context)
    {
        _context = context;
    }

    public async Task<List<MedicoDTO>> BuscarMedicos(BuscarMedicosRequest request)
    {
        var query = _context.Medicos
            .Include(m => m.Usuario)
            .Include(m => m.Especialidad)
            .Include(m => m.MedicosSedes)
                .ThenInclude(ms => ms.Sede)
            .Where(m => m.Activo);

        if (request.EspecialidadID.HasValue)
        {
            query = query.Where(m => m.EspecialidadID == request.EspecialidadID.Value);
        }

        if (!string.IsNullOrEmpty(request.NombreMedico))
        {
            query = query.Where(m => m.Usuario!.NombreCompleto.Contains(request.NombreMedico));
        }

        if (request.SedeID.HasValue)
        {
            query = query.Where(m => m.MedicosSedes!.Any(ms => ms.SedeID == request.SedeID.Value && ms.Activo));
        }

        var medicos = await query.ToListAsync();

        var medicosDTO = new List<MedicoDTO>();
        foreach (var medico in medicos)
        {
            var dto = await MapToDTO(medico, request.Fecha);
            medicosDTO.Add(dto);
        }

        return medicosDTO;
    }

    public async Task<MedicoDTO?> GetMedicoById(int medicoId)
    {
        var medico = await _context.Medicos
            .Include(m => m.Usuario)
            .Include(m => m.Especialidad)
            .Include(m => m.MedicosSedes)
                .ThenInclude(ms => ms.Sede)
            .FirstOrDefaultAsync(m => m.MedicoID == medicoId && m.Activo);

        if (medico == null)
            return null;

        return await MapToDTO(medico, null);
    }

    public async Task<List<Especialidad>> GetEspecialidades()
    {
        return await _context.Especialidades
            .Where(e => e.Activo)
            .OrderBy(e => e.Nombre)
            .ToListAsync();
    }

    public async Task<List<SedeDTO>> GetSedes()
    {
        return await _context.Sedes
            .Where(s => s.Activo)
            .Select(s => new SedeDTO
            {
                SedeID = s.SedeID,
                Nombre = s.Nombre,
                Direccion = s.Direccion,
                Ciudad = s.Ciudad
            })
            .ToListAsync();
    }

    public async Task<List<HorarioDisponibleDTO>> GetHorariosDisponibles(int medicoId, int sedeId, DateTime fecha)
    {
        var horarios = new List<HorarioDisponibleDTO>();
        
        for (int i = 0; i < 7; i++)
        {
            var fechaActual = fecha.AddDays(i);
            var diaSemana = (int)fechaActual.DayOfWeek;
            if (diaSemana == 0) diaSemana = 7;

            var horarioMedico = await _context.HorariosDisponibles
                .FirstOrDefaultAsync(h => h.MedicoID == medicoId 
                    && h.SedeID == sedeId 
                    && h.DiaSemana == diaSemana 
                    && h.Activo);

            if (horarioMedico != null)
            {
                var citasExistentes = await _context.Citas
                    .Where(c => c.MedicoID == medicoId 
                        && c.SedeID == sedeId
                        && c.FechaCita.Date == fechaActual.Date
                        && c.Estado != "Cancelada")
                    .Select(c => c.FechaCita.TimeOfDay)
                    .ToListAsync();

                var horasDisponibles = GenerarHorasDisponibles(
                    horarioMedico.HoraInicio, 
                    horarioMedico.HoraFin, 
                    citasExistentes);

                if (horasDisponibles.Any())
                {
                    horarios.Add(new HorarioDisponibleDTO
                    {
                        Fecha = fechaActual,
                        HorasDisponibles = horasDisponibles
                    });
                }
            }
        }

        return horarios;
    }

    private async Task<MedicoDTO> MapToDTO(Medico medico, DateTime? fecha)
    {
        string? proximaCita = null;
        
        if (fecha.HasValue && medico.MedicosSedes?.Any() == true)
        {
            var primeraSedeId = medico.MedicosSedes.First().SedeID;
            var horarios = await GetHorariosDisponibles(medico.MedicoID, primeraSedeId, fecha.Value);
            
            if (horarios.Any() && horarios[0].HorasDisponibles.Any())
            {
                proximaCita = $"{horarios[0].Fecha:dddd, h:mm tt}";
            }
        }

        return new MedicoDTO
        {
            MedicoID = medico.MedicoID,
            NombreCompleto = medico.Usuario?.NombreCompleto ?? "",
            Email = medico.Usuario?.Email ?? "",
            Telefono = medico.Usuario?.Telefono,
            EspecialidadID = medico.EspecialidadID,
            EspecialidadNombre = medico.Especialidad?.Nombre ?? "",
            NumeroLicencia = medico.NumeroLicencia,
            Biografia = medico.Biografia,
            FotoURL = medico.FotoURL,
            Calificacion = medico.Calificacion,
            NumeroResenas = medico.NumeroResenas,
            AnosExperiencia = medico.AnosExperiencia,
            Sedes = medico.MedicosSedes?
                .Where(ms => ms.Activo)
                .Select(ms => new SedeDTO
                {
                    SedeID = ms.Sede!.SedeID,
                    Nombre = ms.Sede.Nombre,
                    Direccion = ms.Sede.Direccion,
                    Ciudad = ms.Sede.Ciudad
                }).ToList(),
            ProximaCita = proximaCita
        };
    }

    private static List<string> GenerarHorasDisponibles(TimeSpan horaInicio, TimeSpan horaFin, List<TimeSpan> citasExistentes)
    {
        var horas = new List<string>();
        var horaActual = horaInicio;
        var duracionCita = TimeSpan.FromMinutes(30);

        while (horaActual.Add(duracionCita) <= horaFin)
        {
            if (!citasExistentes.Contains(horaActual))
            {
                horas.Add($"{horaActual:hh\\:mm} {(horaActual.Hours < 12 ? "AM" : "PM")}");
            }
            horaActual = horaActual.Add(duracionCita);
        }

        return horas;
    }
}
