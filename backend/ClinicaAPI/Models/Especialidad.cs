using System.ComponentModel.DataAnnotations;

namespace ClinicaAPI.Models;

public class Especialidad
{
    [Key]
    public int EspecialidadID { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Descripcion { get; set; }

    public bool Activo { get; set; } = true;

    public virtual ICollection<Medico>? Medicos { get; set; }
}
