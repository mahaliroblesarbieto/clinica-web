using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicaAPI.Models;

public class Medico
{
    [Key]
    public int MedicoID { get; set; }

    [Required]
    public int UsuarioID { get; set; }

    [Required]
    public int EspecialidadID { get; set; }

    [Required]
    [MaxLength(50)]
    public string NumeroLicencia { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Biografia { get; set; }

    [MaxLength(500)]
    public string? FotoURL { get; set; }

    [Column(TypeName = "decimal(3,2)")]
    public decimal Calificacion { get; set; } = 0;

    public int NumeroResenas { get; set; } = 0;

    [Column("AniosExperiencia")]
    public int AnosExperiencia { get; set; } = 0;

    public bool Activo { get; set; } = true;

    [ForeignKey("UsuarioID")]
    public virtual Usuario? Usuario { get; set; }

    [ForeignKey("EspecialidadID")]
    public virtual Especialidad? Especialidad { get; set; }

    public virtual ICollection<MedicoSede>? MedicosSedes { get; set; }
    public virtual ICollection<Cita>? Citas { get; set; }
    public virtual ICollection<HorarioDisponible>? Horarios { get; set; }
}
