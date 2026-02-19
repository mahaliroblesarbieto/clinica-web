namespace ClinicaAPI.DTOs;

public class MedicoDTO
{
    public int MedicoID { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public int EspecialidadID { get; set; }
    public string EspecialidadNombre { get; set; } = string.Empty;
    public string NumeroLicencia { get; set; } = string.Empty;
    public string? Biografia { get; set; }
    public string? FotoURL { get; set; }
    public decimal Calificacion { get; set; }
    public int NumeroResenas { get; set; }
    public int AnosExperiencia { get; set; }
    public List<SedeDTO>? Sedes { get; set; }
    public string? ProximaCita { get; set; }
}

public class SedeDTO
{
    public int SedeID { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
}

public class BuscarMedicosRequest
{
    public int? EspecialidadID { get; set; }
    public string? NombreMedico { get; set; }
    public int? SedeID { get; set; }
    public DateTime? Fecha { get; set; }
}

public class HorarioDisponibleDTO
{
    public DateTime Fecha { get; set; }
    public List<string> HorasDisponibles { get; set; } = new();
}
