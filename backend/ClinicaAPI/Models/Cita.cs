using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class Cita
{
    [Key]
    public int CitaID { get; set; }

    [Required]
    public int PacienteID { get; set; }

    [Required]
    public int MedicoID { get; set; }

    [Required]
    public int SedeID { get; set; }

    [Required]
    public DateTime FechaCita { get; set; }

    public int Duracion { get; set; } = 30;

    [Required]
    [MaxLength(100)]
    public string TipoServicio { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Estado { get; set; } = "Pendiente";

    [MaxLength(500)]
    public string? MotivoConsulta { get; set; }

    [MaxLength(1000)]
    public string? NotasMedico { get; set; }

    [MaxLength(1000)]
    public string? Diagnostico { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? ValorConsulta { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? ValorCobertura { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? TotalPagar { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.Now;

    public DateTime? FechaModificacion { get; set; }

    [ForeignKey("PacienteID")]
    public virtual Usuario? Paciente { get; set; }

    [ForeignKey("MedicoID")]
    public virtual Medico? Medico { get; set; }

    [ForeignKey("SedeID")]
    public virtual Sede? Sede { get; set; }

    public virtual ICollection<Notificacion>? Notificaciones { get; set; }
}
