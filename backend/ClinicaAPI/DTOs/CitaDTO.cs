namespace ClinicaAPI.DTOs;

public class CitaDTO
{
    public int CitaID { get; set; }
    public int PacienteID { get; set; }
    public string? PacienteNombre { get; set; }
    public int MedicoID { get; set; }
    public string? MedicoNombre { get; set; }
    public string? EspecialidadNombre { get; set; }
    public string? MedicoFoto { get; set; }
    public int SedeID { get; set; }
    public string? SedeNombre { get; set; }
    public string? SedeDireccion { get; set; }
    public DateTime FechaCita { get; set; }
    public int Duracion { get; set; }
    public string TipoServicio { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? MotivoConsulta { get; set; }
    public decimal? ValorConsulta { get; set; }
    public decimal? ValorCobertura { get; set; }
    public decimal? TotalPagar { get; set; }
    public DateTime FechaCreacion { get; set; }
}

public class CrearCitaRequest
{
    public int PacienteID { get; set; }
    public int MedicoID { get; set; }
    public int SedeID { get; set; }
    public DateTime FechaCita { get; set; }
    public string TipoServicio { get; set; } = string.Empty;
    public string? MotivoConsulta { get; set; }
    public decimal? ValorConsulta { get; set; }
    public decimal? ValorCobertura { get; set; }
}

public class ActualizarEstadoCitaRequest
{
    public int CitaID { get; set; }
    public string NuevoEstado { get; set; } = string.Empty;
}
